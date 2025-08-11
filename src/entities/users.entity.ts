import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Subscriptions } from "./subscriptions.entity";

@Index("email", ["email"], { unique: true })
@Index("username", ["username"], { unique: true })
@Entity("users", { schema: "history" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id" })
  userId: number;

  @Column("varchar", { name: "username", unique: true, length: 100 })
  username: string;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("varchar", { name: "password_hash", length: 255 })
  passwordHash: string;

  @Column("tinyint", {
    name: "is_premium",
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isPremium: boolean | null;

  @Column("enum", {
    name: "role",
    nullable: true,
    enum: ["USER", "ADMIN"],
    default: () => "'USER'",
  })
  role: "USER" | "ADMIN" | null;

  @Column("enum", {
    name: "subscription_type",
    nullable: true,
    enum: ["monthly", "yearly"],
  })
  subscriptionType: "monthly" | "yearly" | null;

  @Column("datetime", { name: "subscription_expires_at", nullable: true })
  subscriptionExpiresAt: Date | null;

  @Column("tinyint", {
    name: "is_verified",
    width: 1,
    default: () => "'0'",
  })
  isVerified: boolean;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => Subscriptions, (subscriptions) => subscriptions.user)
  subscriptions: Subscriptions[];
}
