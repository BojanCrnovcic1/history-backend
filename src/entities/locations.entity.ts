import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Events } from "./events.entity";

@Entity("locations", { schema: "history" })
export class Locations {
  @PrimaryGeneratedColumn({ type: "int", name: "location_id" })
  locationId: number;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @Column("decimal", { name: "latitude", precision: 10, scale: 7 })
  latitude: string;

  @Column("decimal", { name: "longitude", precision: 10, scale: 7 })
  longitude: string;

  @OneToMany(() => Events, (events) => events.location)
  events: Events[];
}
