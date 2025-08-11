import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("IDX_email", ["email"], {})
@Entity("password_reset_requests", { schema: "history" })
export class PasswordResetRequests {
  @PrimaryGeneratedColumn({ type: "int", name: "password_reset_id" })
  passwordResetId: number;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "code", length: 10 })
  code: string;

  @Column("datetime", { name: "expires_at" })
  expiresAt: Date;

  @Column("tinyint", { name: "is_used", width: 1, default: () => "'0'" })
  isUsed: boolean;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;
}
