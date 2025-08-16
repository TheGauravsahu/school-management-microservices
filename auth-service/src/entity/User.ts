import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "../common/types";
import { VerificationToken } from "./VerificationToken";
import { RefreshToken } from "./RefreshToken";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false, nullable: true })
  password!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.STUDENT })
  role!: UserRole;

  @Column({ default: false })
  isActivated!: boolean;

  @Column({ nullable: true })
  externalId!: string;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens!: RefreshToken[];

  @OneToMany(() => VerificationToken, (token) => token.user)
  verificationTokens!: VerificationToken[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
