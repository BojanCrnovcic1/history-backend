import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TimePeriods } from "src/entities/time-periods.entity";
import { TimePeriodsService } from "./time-periods.service";
import { ApiResponse } from "src/misc/api.response.class";
import { CreateTimePeriodDto } from "./dto/create.time.period.dto";
import { UpdateTimePeriodDto } from "./dto/update.time.period.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { TimePeriodTranslationDto } from "./dto/time.period.translation.dto";

@Controller('api/time-periods')
export class TimePeriodsController {
  constructor(
    private readonly timePeriodService: TimePeriodsService
  ) {}

  @Get()
  async allTimePeriods(): Promise<TimePeriods[]> {
    return await this.timePeriodService.all();
  }

  @Get('roots')
  async roots(): Promise<TimePeriods[]> {
    return await this.timePeriodService.roots();
  }

  @Get("with-translation")
  async allWithTranslation(@Query("lang") lang: string) {
    return this.timePeriodService.allWithTranslation(lang || "sr");
  }

  @Get('byName/:name')
  async timePeroidByName(@Param('name') name: string): Promise<TimePeriods | ApiResponse> {
    return await this.timePeriodService.findByName(name);
  }

  @Get(':id/events')
  async events(@Param('id') timePeriodId: number) {
    return await this.timePeriodService.getEventsForPeriod(Number(timePeriodId));
  }

  @Get(':id')
  async timePeriodById(@Param('id') timePeriodId: number): Promise<TimePeriods | ApiResponse> {
    return await this.timePeriodService.byId(Number(timePeriodId));
  }

  @Get(':id/translate')
  async getTimePeriodTranslation(@Param('id') id: number, @Query('lang') lang: string
  ) {
    return this.timePeriodService.byIdWithTranslation(Number(id), lang || 'sr');
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  async createTimePeroid(@Body() createData: CreateTimePeriodDto): Promise<TimePeriods | ApiResponse> {
    return await this.timePeriodService.create(createData);
  }

  @Post(":id/translation")
  @UseGuards(AuthGuard)
  @Roles("ADMIN")
  async addTranslation(@Param("id") id: number, @Body() dto: TimePeriodTranslationDto
  ): Promise<ApiResponse> {
    return this.timePeriodService.addOrUpdateTranslation(Number(id), dto);
  }

  @Patch(':id/update')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  async updateTimePeroid(@Param('id') timePeriodId: number, @Body() updateData: UpdateTimePeriodDto):
  Promise<TimePeriods | ApiResponse> {
    return await this.timePeriodService.update(Number(timePeriodId), updateData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  async removeTimePeroid(@Param('id') timePeriodId: number): Promise<ApiResponse> {
    return await this.timePeriodService.remove(Number(timePeriodId));
  }
}
