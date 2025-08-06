import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ email, password, role }: UserData) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      const err = createHttpError(400, "Email is already exists!");
      throw err;
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      return this.userRepository.save({
        email,
        password: hashedPassword,
        role,
      });
    } catch (err) {
      const error = createHttpError(
        500,
        "Failed to store the data in the database"
      );
      throw error;
    }
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "password", "role", "createdAt", "updatedAt"],
    });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user;
  }
}
