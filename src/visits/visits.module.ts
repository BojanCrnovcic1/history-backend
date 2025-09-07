import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Visits } from "src/entities/visits.entity";
import { VisitStatus } from "src/entities/visit-status.entity";
import { VisitsService } from "./visits.service";
import { VisitsController } from "./visits.controller";


@Module({
  imports: [TypeOrmModule.forFeature([Visits, VisitStatus])],
  providers: [VisitsService],
  controllers: [VisitsController],
  exports: [VisitsService]
})
export class VisitsModule {}
