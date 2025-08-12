import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @Column("int", { name: "parent_time_period_id", nullable: true })
  parentTimePeriodId: number | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @ManyToOne(() => TimePeriods, (tp) => tp.children, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "parent_time_period_id", referencedColumnName: "timePeriodId" }])
  parent: TimePeriods | null;

  @OneToMany(() => TimePeriods, (tp) => tp.parent)
  children: TimePeriods[];


  @OneToMany(() => Events, (events) => events.timePeriod)
  events: Events[];
}
