import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Visits } from "src/entities/visits.entity";
import { VisitStatus } from "src/entities/visit-status.entity";

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visits)
    private readonly visitsRepository: Repository<Visits>,

    @InjectRepository(VisitStatus)
    private readonly visitStatusRepository: Repository<VisitStatus>,
  ) {}

  /**
   * Snimanje posete
   */
  async trackVisit(visitorId: string, ipAddress?: string, userAgent?: string) {
    const visit = this.visitsRepository.create({
      visitorId,
      ipAddress,
      userAgent,
    });
    await this.visitsRepository.save(visit);

    await this.updateAggregates();
    return visit;
  }

  /**
   * Ažuriranje dnevnih/weekly/monthly/yearly statistika
   */
  private async updateAggregates() {
    const granularities: Array<"day" | "week" | "month" | "year"> = [
      "day",
      "week",
      "month",
      "year",
    ];

    for (const g of granularities) {
      let dateFormat = "";
      switch (g) {
        case "day":
          dateFormat = "%Y-%m-%d";
          break;
        case "week":
          dateFormat = "%x-%v"; // ISO year-week
          break;
        case "month":
          dateFormat = "%Y-%m";
          break;
        case "year":
          dateFormat = "%Y";
          break;
      }

      const query = await this.visitsRepository
        .createQueryBuilder("v")
        .select(`DATE_FORMAT(v.visited_at, '${dateFormat}')`, "periodKey")
        .addSelect("MIN(DATE(v.visited_at))", "periodStart")
        .addSelect("COUNT(*)", "totalVisits")
        .addSelect("COUNT(DISTINCT v.visitor_id)", "uniqueVisitors")
        .groupBy("periodKey")
        .orderBy("periodStart", "DESC")
        .getRawMany();

      for (const row of query) {
        await this.visitStatusRepository
          .createQueryBuilder()
          .insert()
          .into(VisitStatus)
          .values({
            granularity: g,
            periodKey: row.periodKey,
            periodStart: row.periodStart,
            totalVisits: row.totalVisits,
            uniqueVisitors: row.uniqueVisitors,
          })
          .orUpdate(
            ["total_visits", "unique_visitors"],
            ["granularity", "period_key"],
          )
          .execute();
      }
    }
  }

  /**
   * Vraća statistiku za odabranu granularnost (day/week/month/year)
   */
  async getStats(granularity: "day" | "week" | "month" | "year") {
    return this.visitStatusRepository.find({
      where: { granularity },
      order: { periodStart: "DESC" },
    });
  }

  /**
   * Vraća sve posete (za detaljan prikaz ako admin želi)
   */
  async getAllVisits() {
    return this.visitsRepository.find({
      order: { visitedAt: "DESC" },
    });
  }
}
