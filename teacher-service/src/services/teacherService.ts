import { Logger } from "winston";
import { ITeacher } from "../types";
import { TeacherRepository } from "../repositories/teacheRepository";
import createHttpError from "http-errors";

export class TeacherService {
  constructor(
    private logger: Logger,
    private teacherRepository: TeacherRepository
  ) {}

  async createTeacher(data: ITeacher) {
    try {
      const isExisting = await this.teacherRepository.findByEmail(data.email);
      if (isExisting)
        throw createHttpError(400, "Teacher with this email already exists.");
      return await this.teacherRepository.create(data);
    } catch (error) {
      this.logger.error("Error creating teacher", error);
      throw error;
    }
  }

  async getAllTeachers() {
    try {
      return await this.teacherRepository.findAll();
    } catch (error) {
      this.logger.error("Error fetching all teachers", error);
      throw error;
    }
  }

  async getTeacherByUserId(userId: string) {
    try {
      return await this.teacherRepository.findByUserId(userId);
    } catch (error) {
      this.logger.error(`Error fetching teacher with userId: ${userId}`, error);
      throw error;
    }
  }

  async getTeacherById(id: string) {
    try {
      const teacher = await this.teacherRepository.findById(id);
      if (!teacher) throw createHttpError(404, "Teacher not found.");
      return teacher;
    } catch (error) {
      this.logger.error(`Error fetching teacher with ID: ${id}`, error);
      throw error;
    }
  }

  async updateTeacher(id: string, update: Partial<ITeacher>) {
    try {
      const updatedTeacher = await this.teacherRepository.update(id, update);
      if (!updatedTeacher) throw createHttpError(404, "Teacher not found.");
      return updatedTeacher;
    } catch (error) {
      this.logger.error(`Error updating teacher with ID: ${id}`, error);
      throw error;
    }
  }

  async deleteTeacher(id: string) {
    try {
      const deletedTeacher = await this.teacherRepository.delete(id);
      if (!deletedTeacher) throw createHttpError(404, "Teacher not found.");
      return deletedTeacher;
    } catch (error) {
      this.logger.error(`Error deleting teacher with ID: ${id}`, error);
      throw error;
    }
  }
}
