import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Events } from "src/entities/events.entity";
import { Locations } from "src/entities/locations.entity";
import { LocationsController } from "./locations.controller";
import { LocationsService } from "./locations.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Locations,
            Events,
        ])
    ],
    controllers: [LocationsController],
    providers: [LocationsService],
    exports: [LocationsService]
})
export class LocationsModule {}