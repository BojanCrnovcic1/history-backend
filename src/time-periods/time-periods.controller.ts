import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { TimePeriods } from "src/entities/time-periods.entity";
import { TimePeriodsService } from "./time-periods.service";
import { ApiResponse } from "src/misc/api.response.class";
import { CreateTimePeriodDto } from "./dto/create.time.period.dto";
import { UpdateTimePeriodDto } from "./dto/update.time.period.dto";

@Controller('api/time-periods')
export class TimePeriodsController {
    constructor(
        private readonly timePeriodService: TimePeriodsService
    ) {}

    @Get()
    async allTimePeriods(): Promise<TimePeriods[]> {
        return await this.timePeriodService.all();
    };

    @Get(':id')
    async timePeriodById(@Param('id') timePeriodId: number): Promise<TimePeriods | ApiResponse> {
        return await this.timePeriodService.byId(timePeriodId);
    };

    @Get('byName/:name')
    async timePeroidByName(@Param('name') name: string): Promise<TimePeriods | ApiResponse> {
        return await this.timePeriodService.findByName(name);
    };

    @Post()
    async createTimePeroid(@Body() createData: CreateTimePeriodDto): Promise<TimePeriods | ApiResponse> {
        return await this.timePeriodService.create(createData);
    };

    @Patch(':id/update')
    async updateTimePeroid(@Param('id') timePeriodId: number,@Body() updateData: UpdateTimePeriodDto): 
    Promise<TimePeriods | ApiResponse> {
        return await this.timePeriodService.update(timePeriodId, updateData);
    };

    @Delete(':id')
    async removeTimePeroid(@Param('id') timePeriodId: number): Promise<ApiResponse> {
        return await this.timePeriodService.remove(timePeriodId);
    };
}