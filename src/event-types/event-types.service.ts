import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventTypes } from "src/entities/event-types.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

type EventTypeName = 'event' | 'battle' | 'biography';

@Injectable()
export class EventTypesService {
    constructor(
        @InjectRepository(EventTypes) private readonly eventTypesRepo: Repository<EventTypes>
    ) {}

    async findAll(): Promise<EventTypes[]> {
        return await this.eventTypesRepo.find({
            relations: ['events']
        });
    }
    
    async findById(eventTypeId: number): Promise<EventTypes | ApiResponse> {
        const eventType = await this.eventTypesRepo.findOne({
            where: {eventTypeId: eventTypeId},
            relations: ['events']
        });
        if (!eventType) {
            return new ApiResponse('error', -3001, 'Event types not found!')
        }
        return eventType;
    }

    async create(eventTypeData: { name: EventTypeName }): Promise<EventTypes | ApiResponse> {
        const eventType = this.eventTypesRepo.create(eventTypeData);
        if (!eventType) {
            return new ApiResponse('error', -3002, 'Event types is not created!')
        }
        const saveEventType = this.eventTypesRepo.save(eventType);
        if (!saveEventType) {
            return new ApiResponse('error', -3003, 'Event types is not saved!')
        };

        return saveEventType;
    }

    async update(eventTypeId: number, eventTypeData: Partial<EventTypes>): Promise<EventTypes | null> {
        await this.eventTypesRepo.update(eventTypeId, eventTypeData);
        return this.eventTypesRepo.findOneBy({ eventTypeId: eventTypeId });
    }

    async remove(eventTypeId: number): Promise<ApiResponse> {
        const eventType = await this.eventTypesRepo.findOne({
            where: {eventTypeId: eventTypeId},
            relations: ['events']
        })
        if (!eventType) {
            return new ApiResponse('error', -3001, 'Event types not found!')
        }
        await this.eventTypesRepo.remove(eventType);
        return new ApiResponse('success', 200, 'Event successfully deleted.');
    }

    async findByName(name: EventTypeName): Promise<EventTypes | ApiResponse> {
        const eventType = await this.eventTypesRepo.findOneBy({name: name });
        if (!eventType) {
            return new ApiResponse('error', -3001, 'Event types not found!')
        }
        return eventType;
    }
}