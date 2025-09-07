import {
    Controller,
    Get,
    Post,
    Body,
    Ip,
    Headers,
    Query,
  } from "@nestjs/common";
  import { VisitsService } from "./visits.service";
  
  @Controller("api/visits")
  export class VisitsController {
    constructor(private readonly visitsService: VisitsService) {}
  
    /**
     * Snimanje posete (frontend pozove čim korisnik otvori aplikaciju)
     */
    @Post("track")
    async trackVisit(
      @Body("visitorId") visitorId: string,
      @Ip() ip: string,
      @Headers("user-agent") userAgent: string,
    ) {
      return this.visitsService.trackVisit(visitorId, ip, userAgent);
    }
  
    /**
     * Statistika poseta po granularnosti
     * Primjer: GET /visits/stats?granularity=day
     */
    @Get("stats")
    async getStats(
      @Query("granularity") granularity: "day" | "week" | "month" | "year",
    ) {
      return this.visitsService.getStats(granularity);
    }
  
    /**
     * Svi logovi poseta
     */
    @Get("all")
    async getAllVisits() {
      return this.visitsService.getAllVisits();
    }
  }
  