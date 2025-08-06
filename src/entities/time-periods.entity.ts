import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Events } from "./events.entity";

@Entity("time_periods", { schema: "history" })
export class TimePeriods {
  @PrimaryGeneratedColumn({ type: "int", name: "time_period_id" })
  timePeriodId: number;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @Column("varchar", { name: "start_year", length: 50,  nullable: true })
  startYear: string | null;

  @Column("varchar", { name: "end_year", length: 50, nullable: true })
  endYear: string | null;

  @OneToMany(() => Events, (events) => events.timePeriod)
  events: Events[];
}
