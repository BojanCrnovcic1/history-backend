import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventTypes } from "src/entities/event-types.entity";
import { Events } from "src/entities/events.entity";
import { EventTypesController } from "./event-types.controller";
import { EventTypesService } from "./event-types.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EventTypes,
            Events
        ])
    ],
    controllers: [EventTypesController],
    providers: [EventTypesService],
    exports: [EventTypesService]
})
export class EventTypesModule {}