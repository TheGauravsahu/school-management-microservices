import { Logger } from "winston";
import { ITeacher } from "../types";
import { teacherModel } from "../models/Teacher";

export class TeacherRepository {
  constructor(private logger: Logger) {}

  async create(data: ITeacher) {
    return await teacherModel.create(data);
  }

  async findAll() {
    return await teacherModel.find();
  }

  async findByUserId(userId: string) {
    return await teacherModel.findOne({ userId });
  }

  async findById(id: string) {
    return await teacherModel.findById(id);
  }

  async findByEmail(email: string) {
    return await teacherModel.findOne({ email });
  }

  async update(id: string, data: Partial<ITeacher>) {
    return await teacherModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return await teacherModel.findByIdAndDelete(id);
  }
}
