import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { EventTypesService } from "./event-types.service";
import { EventTypes } from "src/entities/event-types.entity";
import { ApiResponse } from "src/misc/api.response.class";

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
    async create(@Body() eventTypeData: { name: EventTypeName }): Promise<EventTypes | ApiResponse> {
        return await this.eventTypesService.create(eventTypeData);
    };

    @Patch(':id')
    async update(@Param('id') eventTypeId: number, @Body() eventTypeData: { name: EventTypeName }):
    Promise<EventTypes | null> {
        return await this.eventTypesService.update(eventTypeId, eventTypeData);
    };

    @Delete(':id')
    async deleteEventType(@Param('id') eventTypeId: number): Promise<ApiResponse> {
        return await this.eventTypesService.remove(eventTypeId);
    };
}