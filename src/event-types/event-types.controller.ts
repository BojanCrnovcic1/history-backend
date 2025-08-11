import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { EventTypesService } from "./event-types.service";
import { EventTypes } from "src/entities/event-types.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";

type EventTypeName = 'event' | 'battle' | 'biography';

@Controller('api/event-types')
export class EventTypesController {
    constructor(
        private readonly eventTypesService: EventTypesService
    ) {}

    @Get()
    async allEventTypes(): Promise<EventTypes[]> {
        return await this.eventTypesService.findAll();
    };

    @Get(':id')
    async byId(@Param('id') eventTypeId: number): Promise<EventTypes | ApiResponse> {
        return await this.eventTypesService.findById(eventTypeId);
    };

    @Get('byName/:name')
    async findByName(@Param('name') name: EventTypeName): Promise<EventTypes | ApiResponse> {
        return this.eventTypesService.findByName(name);
    };

    @Post()
    @UseGuards(AuthGuard)
    @Roles('ADMIN')
    async create(@Body() eventTypeData: { name: EventTypeName }): Promise<EventTypes | ApiResponse> {
        return await this.eventTypesService.create(eventTypeData);
    };

    @Patch(':id')
    @UseGuards(AuthGuard)
    @Roles('ADMIN')
    async update(@Param('id') eventTypeId: number, @Body() eventTypeData: { name: EventTypeName }):
    Promise<EventTypes | null> {
        return await this.eventTypesService.update(eventTypeId, eventTypeData);
    };

    @Delete(':id')
    @UseGuards(AuthGuard)
    @Roles('ADMIN')
    async deleteEventType(@Param('id') eventTypeId: number): Promise<ApiResponse> {
        return await this.eventTypesService.remove(eventTypeId);
    };
}