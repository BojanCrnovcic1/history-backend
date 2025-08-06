import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TimePeriods } from "src/entities/time-periods.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";
import { CreateTimePeriodDto } from "./dto/create.time.period.dto";
import { UpdateTimePeriodDto } from "./dto/update.time.period.dto";

@Injectable()
export class TimePeriodsService {
    constructor(
        @InjectRepository(TimePeriods) private readonly timePeriodsRepo: Repository<TimePeriods>
    ) {}

    async all(): Promise<TimePeriods[]> {
        return await this.timePeriodsRepo.find({
            relations: ['events']
        })
    };

    async byId(timePeriodId: number): Promise<TimePeriods | ApiResponse> {
        const timePeriod = await this.timePeriodsRepo.findOne({
            where: {timePeriodId: timePeriodId},
            relations: ['events']
        })
        if (!timePeriod) {
            return new ApiResponse('error', -4001, 'Time period not found!')
        }
        return timePeriod;
    };

    async create(createTimePeriodData: CreateTimePeriodDto): Promise<TimePeriods | ApiResponse> {
        const timePeriod = this.timePeriodsRepo.create(createTimePeriodData);
        if (!timePeriod) {
            return new ApiResponse('error', -4002, 'Time period is not created!')
        }
        const savedTimePeriod = await this.timePeriodsRepo.save(timePeriod);
        if (!savedTimePeriod) {
            return new ApiResponse('error', -4003, 'Time peroid is not saved!')
        }
        return savedTimePeriod;
    };

    async update(timePeriodId: number, updateTimePeriodData: UpdateTimePeriodDto): Promise<ApiResponse> {

        const timePeriod = await this.byId(timePeriodId);
        if (timePeriod instanceof ApiResponse) {
            return timePeriod; 
        }

        Object.assign(timePeriod, updateTimePeriodData);
        await this.timePeriodsRepo.save(timePeriod);
        return new ApiResponse('success', 200, 'Event successfully updated.');
    };

    async remove(timePeriodId: number): Promise<ApiResponse> {
        const timePeriod = await this.timePeriodsRepo.findOne({
            where: {timePeriodId: timePeriodId},
            relations: ['events']
        })
        if (!timePeriod) {
            return new ApiResponse('error', -4001, 'Time period not found!')
        }
        await this.timePeriodsRepo.remove(timePeriod);
        return new ApiResponse('success', 200, 'Event successfully deleted.');
    };

    async findByName(name: string): Promise<TimePeriods | ApiResponse> {
        const timePeriod = await this.timePeriodsRepo.findOneBy({name: name });
        if (!timePeriod) {
            return new ApiResponse('error', -4001, 'Time period not found!')
        }
        return timePeriod;
    };
}