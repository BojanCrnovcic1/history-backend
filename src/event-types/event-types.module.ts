import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventTypes } from "src/entities/event-types.entity";
import { Events } from "src/entities/events.entity";
import { EventTypesController } from "./event-types.controller";
import { EventTypesService } from "./event-types.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EventTypes,
            Events
        ]),
        AuthModule
    ],
    controllers: [EventTypesController],
    providers: [EventTypesService],
    exports: [EventTypesService]
})
export class EventTypesModule {}