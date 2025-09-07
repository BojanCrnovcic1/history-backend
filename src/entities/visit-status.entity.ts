import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_period", ["granularity", "periodKey"], { unique: true })
@Entity("visit_status", { schema: "history" })
export class VisitStatus {
  @PrimaryGeneratedColumn({ type: "bigint", name: "visit_status_id" })
  visitStatusId: string;

  @Column("enum", {
    name: "granularity",
    enum: ["day", "week", "month", "year"],
  })
  granularity: "day" | "week" | "month" | "year";

  @Column("varchar", { name: "period_key", length: 20 })
  periodKey: string;

  @Column("date", { name: "period_start" })
  periodStart: Date;

  @Column("int", { name: "total_visits" })
  totalVisits: number;

  @Column("int", { name: "unique_visitors" })
  uniqueVisitors: number;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;
}
