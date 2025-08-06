import { Logger } from "winston";
import { StudentRepostory } from "../repository/studentRepository";

export class StudentService {
  constructor(
    private studentRepository: StudentRepostory,
    private logger: Logger
  ) {}
}
