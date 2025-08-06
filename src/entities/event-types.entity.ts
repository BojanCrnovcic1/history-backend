import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Events } from "./events.entity";

@Entity("event_types", { schema: "history" })
export class EventTypes {
  @PrimaryGeneratedColumn({ type: "int", name: "event_type_id" })
  eventTypeId: number;

  @Column({
    type: "enum",
    name: "name",
    enum: ['event', 'battle', 'biography'],
    nullable: false 
  })
  name: 'event' | 'battle' | 'biography';

  @OneToMany(() => Events, (events) => events.eventType)
  events: Events[];
}
