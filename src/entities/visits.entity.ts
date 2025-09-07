import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_visited_at", ["visitedAt"], {})
@Index("idx_vistor_id", ["visitorId"], {})
@Entity("visits", { schema: "history" })
export class Visits {
  @PrimaryGeneratedColumn({ type: "bigint", name: "visit_id" })
  visitId: string;

  @Column("varchar", { name: "visitor_id", length: 64 })
  visitorId: string;

  @Column("varchar", { name: "ip_address", nullable: true, length: 45 })
  ipAddress: string | null;

  @Column("text", { name: "user_agent", nullable: true })
  userAgent: string | null;

  @Column("timestamp", {
    name: "visited_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  visitedAt: Date | null;
}
