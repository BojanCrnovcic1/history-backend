import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TimePeriods } from "./time-periods.entity";
import { EventTypes } from "./event-types.entity";
import { Locations } from "./locations.entity";
import { Media } from "./media.entity";
import { EventTranslation } from "./event-translation.entity";

@Index("event_type_id", ["eventTypeId"], {})
@Index("location_id", ["locationId"], {})
@Index("time_period_id", ["timePeriodId"], {})
@Entity("events", { schema: "history" })
export class Events {
  @PrimaryGeneratedColumn({ type: "int", name: "event_id" })
  eventId: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("int", { name: "time_period_id", nullable: true })
  timePeriodId: number | null;

  @Column("int", { name: "event_type_id", nullable: true })
  eventTypeId: number | null;

  @Column("int", { name: "location_id", nullable: true })
  locationId: number | null;

  @Column("varchar", { name: "year", length: 50, nullable: true })
  year: string| null;

  @Column("tinyint", {
    name: "is_premium",
    nullable: true,
    width: 1,
    transformer: {
      to: (value: boolean | null) => (value ? 1 : 0),
      from: (value: number | null) => !!value,
    },
    default: () => "'0'",
  })
  isPremium: boolean | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => TimePeriods, (timePeriods) => timePeriods.events, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "time_period_id", referencedColumnName: "timePeriodId" },
  ])
  timePeriod: TimePeriods;

  @ManyToOne(() => EventTypes, (eventTypes) => eventTypes.events, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "event_type_id", referencedColumnName: "eventTypeId" }])
  eventType: EventTypes;

  @ManyToOne(() => Locations, (locations) => locations.events, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "location_id", referencedColumnName: "locationId" }])
  location: Locations;

  @OneToMany(() => Media, (media) => media.event, {cascade: true, onDelete: 'CASCADE'})
  media: Media[];

  @OneToMany(() => EventTranslation, (t) => t.event, { cascade: true })
  translations?: EventTranslation[]; 
}
