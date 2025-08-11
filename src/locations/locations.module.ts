import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Events } from "src/entities/events.entity";
import { Locations } from "src/entities/locations.entity";
import { LocationsController } from "./locations.controller";
import { LocationsService } from "./locations.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Locations,
            Events,
        ]),
        AuthModule
    ],
    controllers: [LocationsController],
    providers: [LocationsService],
    exports: [LocationsService]
})
export class LocationsModule {}