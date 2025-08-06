import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Events } from "src/entities/events.entity";
import { TimePeriods } from "src/entities/time-periods.entity";
import { TimePeriodsController } from "./time-periods.controller";
import { TimePeriodsService } from "./time-periods.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TimePeriods,
            Events
        ])
    ],
    controllers: [TimePeriodsController],
    providers: [TimePeriodsService],
    exports: [TimePeriodsService]
})
export class TimePeriodsModule {}