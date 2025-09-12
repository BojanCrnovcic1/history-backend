import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn } from 'typeorm';
import { Events } from './events.entity'; // prilagodi putanju

@Entity('event_translations')
@Index(['event', 'language'], { unique: true })
export class EventTranslation {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'translate_id' })
  translateId: number;

  @ManyToOne(() => Events, (event) => (event as any).translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Events;

  @Column({ name: 'language', type: 'varchar', length: 5 })
  language: string; // 'sr', 'en', ...

  @Column({ name: 'title', type: 'text' })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: "year",  type: "varchar", length: 50, nullable: true })
  year?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
