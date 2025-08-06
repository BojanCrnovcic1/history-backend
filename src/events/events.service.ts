import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Events } from "src/entities/events.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";
import { CreateEventDto } from "./dto/create.event.dto";
import { UpdateEventDto } from "./dto/update.event.dto";

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    ) {}

    async allEvents(): Promise<Events[]> {
         return await this.eventsRepository.find({
            relations: ['timePeriod', 'eventType', 'location', 'media']
        })
    }

    async eventById(eventId: number): Promise<Events | ApiResponse> {
        const event = await this.eventsRepository.findOne({
            where: {eventId: eventId},
            relations: ['timePeriod', 'eventType', 'location', 'media']
        })
        if (!event) {
            return new ApiResponse('error', -2001, 'Event not found!')
        }
        return event;
    }

    async create(createEventDto: CreateEventDto): Promise<Events | ApiResponse> {
        try {
          const event = this.eventsRepository.create(createEventDto);
          await this.eventsRepository.save(event);
      
          return new ApiResponse('success', 201, 'Event successfully created.');
        } catch (error) {
          throw new BadRequestException(
            new ApiResponse('error', -2002, 'Failed to create event.'),
          );
        }
    }
      
    async update(eventId: number, dto: UpdateEventDto): Promise<ApiResponse> {
        const event = await this.eventById(eventId);

        if (event instanceof ApiResponse) {
            return event; 
        }

        Object.assign(event, dto);
        await this.eventsRepository.save(event);
        return new ApiResponse('success', 200, 'Event successfully updated.');
      }
    
    async markAsPremium(eventId: number): Promise<ApiResponse> {
        const event = await this.eventsRepository.findOne({
            where: {eventId: eventId},
            relations: ['timePeriod', 'eventType', 'location', 'media']
        })
        if (!event) {
            return new ApiResponse('error', -2001, 'Event not found!')
        }
        event.isPremium = true;
        await this.eventsRepository.save(event);
        return new ApiResponse('success', 200, 'Event marked as premium.');
      }
    
    async unmarkPremium(eventId: number): Promise<ApiResponse> {
        const event = await this.eventsRepository.findOne({
            where: {eventId: eventId},
            relations: ['timePeriod', 'eventType', 'location', 'media']
        })
        if (!event) {
            return new ApiResponse('error', -2001, 'Event not found!')
        }
        event.isPremium = false;
        await this.eventsRepository.save(event);
        return new ApiResponse('success', 200, 'Event unmarked as premium.');
    }
    
    async setPremiumForAll(status: boolean): Promise<ApiResponse> {
        await this.eventsRepository
          .createQueryBuilder()
          .update(Events)
          .set({ isPremium: status })
          .execute();
    
        return new ApiResponse(
          'success',
          200,
          status
            ? 'All events marked as premium.'
            : 'All events set to non-premium.',
        );
    }
    
    async removeEvent(eventId: number): Promise<ApiResponse> {
        const event = await this.eventsRepository.findOne({
            where: {eventId: eventId},
            relations: ['timePeriod', 'eventType', 'location', 'media']
        })
        if (!event) {
            return new ApiResponse('error', -2001, 'Event not found!')
        }
        await this.eventsRepository.remove(event)
        return new ApiResponse('success', 200, 'Event successfully deleted.');
    }
}