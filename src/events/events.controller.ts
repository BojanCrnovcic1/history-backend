import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
  } from '@nestjs/common';
  import { EventsService } from './events.service';
  import { CreateEventDto } from './dto/create.event.dto';
  import { UpdateEventDto } from './dto/update.event.dto';
import { Events } from 'src/entities/events.entity';
import { ApiResponse } from 'src/misc/api.response.class';
  
  @Controller('api/events')
  export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Patch('premium-all')
    async setPremiumForAll(@Query('status') status: string): Promise<ApiResponse> {
      const isPremium = status === 'true';
      return await this.eventsService.setPremiumForAll(isPremium);
    }
  
    @Get()
    async getAllEvents(): Promise<Events[]> {
      return await this.eventsService.allEvents();
    }
  
    @Get(':id')
    async getEventById(@Param('id') eventId: number): Promise<Events|ApiResponse> {
      return await this.eventsService.eventById(eventId);
    }
  
    @Post()
    async createEvent(@Body() dto: CreateEventDto): Promise<Events | ApiResponse> {
      return await this.eventsService.create(dto);
    }
  
    @Patch(':id')
    async updateEvent(@Param('id') eventId: number, @Body() dto: UpdateEventDto): Promise<ApiResponse> {
      return await this.eventsService.update(eventId, dto);
    }
  
    @Patch(':id/mark-premium')
    async markAsPremium(@Param('id') eventId: number): Promise<ApiResponse> {
      return await this.eventsService.markAsPremium(eventId);
    }
  
    @Patch(':id/unmark-premium')
    async unmarkPremium(@Param('id') eventId: number): Promise<ApiResponse> {
      return await this.eventsService.unmarkPremium(eventId);
    }
  
    @Delete(':id')
    async deleteEvent(@Param('id') eventId: number): Promise<ApiResponse> {
      return await this.eventsService.removeEvent(eventId);
    }
  }
  