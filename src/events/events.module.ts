import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventTypes } from "src/entities/event-types.entity";
import { TimePeriods } from "src/entities/time-periods.entity";
import { Events } from "src/entities/events.entity";
import { Media } from "src/entities/media.entity";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { Locations } from "src/entities/locations.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Events,
            EventTypes,
            TimePeriods,
            Locations,
            Media
        ]),
        AuthModule,
    ],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService]
})
export class EventsModule {}