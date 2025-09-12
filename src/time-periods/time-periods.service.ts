import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TimePeriods } from "src/entities/time-periods.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository, In, IsNull } from "typeorm";
import { CreateTimePeriodDto } from "./dto/create.time.period.dto";
import { UpdateTimePeriodDto } from "./dto/update.time.period.dto";
import { Events } from "src/entities/events.entity";
import { TimePeriodTranslationDto } from "./dto/time.period.translation.dto";
import { TimePeriodTranslation } from "src/entities/time-periods_translation.entity";

@Injectable()
export class TimePeriodsService {
  constructor(
    @InjectRepository(TimePeriods)
    private readonly timePeriodsRepo: Repository<TimePeriods>,
    @InjectRepository(Events)
    private readonly eventsRepo: Repository<Events>,
  ) {}

  async all(): Promise<TimePeriods[]> {
    return await this.timePeriodsRepo.find({
      relations: ['children', 'events', 'translations']
    });
  }

  async roots(): Promise<TimePeriods[]> {
    return await this.timePeriodsRepo.find({
      where: { parentTimePeriodId: IsNull() },
      relations: ['translations', 'children', 'children.events.location', 'children.events.eventType', 'children.events.media', 'children.events.translations']
    });
  }

  async byId(timePeriodId: number): Promise<TimePeriods | ApiResponse> {
    const timePeriod = await this.timePeriodsRepo.findOne({
      where: { timePeriodId },
      relations: ['children', 'events', 'parent', 'translations']
    });
    if (!timePeriod) {
      return new ApiResponse('error', -4001, 'Time period not found!');
    }
    return timePeriod;
  }

  async allWithTranslation(lang: string): Promise<any[]> {

    const timePeriods = await this.timePeriodsRepo.find({
      relations: ["translations"],
    });
  
    return timePeriods.map((tp) => {
      const translations = tp.translations ?? [];
      const translation = translations.find((t) => t.language === lang);
  
      return {
        timePeriodId: tp.timePeriodId,
        name: translation?.name || tp.name,
        startYear: translation?.startYear || tp.startYear,
        endYear: translation?.endYear || tp.endYear,
        description: translation?.description || tp.description,
      };
    });
  }
  
  

  async byIdWithTranslation(timePeriodId: number, lang: string): Promise<any> {
    const tp = await this.timePeriodsRepo.findOne({
      where: { timePeriodId },
      relations: ["translations"],
    });
  
    if (!tp) return new ApiResponse("error", -4001, "Time period not found!");
  
    const translations = tp.translations ?? [];
  
    const translation = translations.find((t) => t.language === lang);
  
    return {
      timePeriodId: tp.timePeriodId,
      name: translation?.name || tp.name,
      startYear: translation?.startYear || tp.startYear,
      endYear: translation?.endYear || tp.endYear,
      description: translation?.description || tp.description,
    };
  }   

  async create(createTimePeriodData: CreateTimePeriodDto): Promise<TimePeriods | ApiResponse> {
    const tp = this.timePeriodsRepo.create(createTimePeriodData as TimePeriods); 
    try {
      const saved = await this.timePeriodsRepo.save(tp);
      return saved;
    } catch (e) {
      return new ApiResponse('error', -4003, 'Time period could not be saved.');
    }
  }

  async addOrUpdateTranslation(
    timePeriodId: number,
    dto: TimePeriodTranslationDto
  ): Promise<ApiResponse> {
    const tp = await this.timePeriodsRepo.findOne({
      where: { timePeriodId },
      relations: ["translations"],
    });
  
    if (!tp) {
      return new ApiResponse("error", -4001, "Time period not found!");
    }
  
    let translation = tp.translations?.find(
      (t) => t.language === dto.language
    ) || null;
  
    if (translation) {
      // update postojećeg
      translation.name = dto.name;
      translation.startYear = dto.startYear;
      translation.endYear = dto.endYear;
      translation.description = dto.description;
    } else {
      // kreiramo novi ENTITET
      const newTranslation = this.timePeriodsRepo.manager.create(
        TimePeriodTranslation,
        {
          ...dto,
          timePeriod: tp,
        }
      ) as TimePeriodTranslation;
  
      if (!tp.translations) {
        tp.translations = [];
      }
      tp.translations.push(newTranslation);
    }
  
    await this.timePeriodsRepo.save(tp);
  
    return new ApiResponse("success", 200, "Translation added/updated.");
  }
  
  
  async update(timePeriodId: number, updateTimePeriodData: UpdateTimePeriodDto): Promise<TimePeriods | ApiResponse> {
    const tpOrResp = await this.byId(timePeriodId);
    if (tpOrResp instanceof ApiResponse) return tpOrResp;

    const tp = tpOrResp as TimePeriods;
    Object.assign(tp, updateTimePeriodData);
    try {
      const saved = await this.timePeriodsRepo.save(tp);
      return saved;
    } catch (e) {
      return new ApiResponse('error', -4004, 'Time period could not be updated.');
    }
  }

  async remove(timePeriodId: number): Promise<ApiResponse> {
    const tp = await this.timePeriodsRepo.findOne({
      where: { timePeriodId },
      relations: ['children', 'events', 'translations']
    });
    if (!tp) return new ApiResponse('error', -4001, 'Time period not found!');
    await this.timePeriodsRepo.remove(tp);
    return new ApiResponse('success', 200, 'Time period deleted.');
  }

  async findByName(name: string): Promise<TimePeriods | ApiResponse> {
    const timePeriod = await this.timePeriodsRepo.findOne({
      where: { name },
      relations: ['children', 'events']
    });
    if (!timePeriod) return new ApiResponse('error', -4001, 'Time period not found!');
    return timePeriod;
  }

  async getAllDescendantIds(rootId: number): Promise<number[]> {
    const ids: number[] = [];
    const q: number[] = [rootId];
    while (q.length) {
      const cur = q.shift()!;
      ids.push(cur);
      const children = await this.timePeriodsRepo.find({
        where: { parentTimePeriodId: cur },
        select: ['timePeriodId']
      });
      for (const c of children) q.push(c.timePeriodId);
    }
    return ids;
  }

  async getEventsForPeriod(rootId: number) {
    const ids = await this.getAllDescendantIds(rootId);
    return this.eventsRepo.find({
      where: { timePeriodId: In(ids) },
      relations: ['media', 'location', 'timePeriod', 'translations'] 
    });
  }
}
