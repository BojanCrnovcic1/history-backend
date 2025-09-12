import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { TimePeriods } from "./time-periods.entity";

@Entity("time_period_translations")
@Index(["timePeriod", "language"], { unique: true })
export class TimePeriodTranslation {
  @PrimaryGeneratedColumn({ name: "time_period_translate_id",type: "bigint" })
  timePeriodTranslateId: number;

  @ManyToOne(() => TimePeriods, (tp) => tp.translations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "time_period_id" })
  timePeriod: TimePeriods;

  @Column({ type: "varchar", length: 5 })
  language: string; // "sr", "en"

  @Column({ type: "varchar", length: 100, nullable: true })
  name?: string;

  @Column({ name: "start_year",  type: "varchar", length: 50, nullable: true })
  startYear?: string;

  @Column({ name: "end_year",  type: "varchar", length: 50, nullable: true })
  endYear?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
