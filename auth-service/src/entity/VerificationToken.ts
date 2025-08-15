import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "verificationTokens" })
export class VerificationToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.verificationTokens, {
    onDelete: "CASCADE",
  })
  user!: User;

  @Index()
  @Column()
  token!: string;

  @Column({ type: "timestamp" })
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ default: false })
  used!: boolean;
}
