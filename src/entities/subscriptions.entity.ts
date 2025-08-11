import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./users.entity";

@Index("user_id", ["userId"], {})
@Entity("subscriptions", { schema: "history" })
export class Subscriptions {
  @PrimaryGeneratedColumn({ type: "int", name: "subscription_id" })
  subscriptionId: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("datetime", { name: "start_date" })
  startDate: Date;

  @Column("datetime", { name: "end_date" })
  endDate: Date;

  @Column("enum", { name: "type", enum: ["monthly", "yearly"] })
  type: "monthly" | "yearly";

  @Column("enum", {
    name: "payment_status",
    nullable: true,
    enum: ["paid", "pending", "failed"],
    default: () => "'pending'",
  })
  paymentStatus: "paid" | "pending" | "failed" | null;

  @Column('varchar', { name: 'paypal_order_id', length: 255, nullable: true })
  paypalOrderId?: string | null;

  @ManyToOne(() => Users, (users) => users.subscriptions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: Users;
}
