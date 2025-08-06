import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "refreshTokens" })
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "timestamp" })
  expiresAt!: Date;

  @ManyToOne(() => User)
  user!: User; // userId

  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
