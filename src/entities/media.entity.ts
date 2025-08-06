import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Events } from "./events.entity";

@Index("event_id", ["eventId"], {})
@Entity("media", { schema: "history" })
export class Media {
  @PrimaryGeneratedColumn({ type: "int", name: "media_id" })
  mediaId: number;

  @Column("int", { name: "event_id", nullable: true })
  eventId: number | null;

  @Column("enum", { name: "media_type", enum: ["image", "video", "audio"] })
  mediaType: "image" | "video" | "audio";

  @Column("text", { name: "url" })
  url: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => Events, (events) => events.media, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "eventId" }])
  event: Events;
}
