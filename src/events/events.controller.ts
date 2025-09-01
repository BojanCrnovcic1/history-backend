import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { EventsService } from './events.service';
  import { CreateEventDto } from './dto/create.event.dto';
  import { UpdateEventDto } from './dto/update.event.dto';
import { Events } from 'src/entities/events.entity';
import { ApiResponse } from 'src/misc/api.response.class';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
  
  @Controller('api/events')
  export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Patch('premium-all')
    async setPremiumForAll(@Query('status') status: string): Promise<ApiResponse> {
      const isPremium = status === 'true';
      return await this.eventsService.setPremiumForAll(isPremium);
    }

    @Get('filtered')
  async getEventsPaginatedAndFiltered(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('eventTypeId') eventTypeId ? : string,
    @Query('timePeriodId') timePeriodId ? : string,
  ): Promise < {
    data: Events[],
    total: number
  } > {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const eventType = eventTypeId ? parseInt(eventTypeId, 10) : undefined;
    const timePeriod = timePeriodId ? parseInt(timePeriodId, 10) : undefined;

    return await this.eventsService.allEventsPaginated(pageNumber, limitNumber, eventType, timePeriod);
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
    @UseGuards(AuthGuard)
    @Roles('ADMIN')
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
  