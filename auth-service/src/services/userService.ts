import { Repository } from "typeorm";
import { UserData } from "../types";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { User } from "../entity/User";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ name, email, password, role, externalId }: UserData) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      const err = createHttpError(400, "Email is already exists!");
      throw err;
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password!, saltRounds);

    try {
      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        role,
        externalId,
      });
      return await this.userRepository.save(user);
    } catch (err) {
      const error = createHttpError(
        500,
        "Failed to store the data in the database"
      );
      throw error;
    }
  }

  async save(data: Partial<User>) {
    return await this.userRepository.save(data);
  }

  async findByEmailWithPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        "id",
        "email",
        "password",
        "role",
        "isActivated",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user?.isActivated) {
      throw createHttpError(
        403,
        "Account not activated. Please verify your email."
      );
    }

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user?.isActivated) {
      throw createHttpError(
        403,
        "Account not activated. Please verify your email."
      );
    }

    return user;
  }

  async findByIdNotActivated(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  async updatePassword(userId: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw createHttpError(404, "User not found");

    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);

    return this.userRepository.save(user);
  }
}
