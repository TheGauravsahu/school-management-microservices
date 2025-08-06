import { Logger } from "winston";
import { StudentService } from "../services/studentService";

export class StudentController {
  constructor(
    private studentService: StudentService,
    private logger: Logger
  ) {}
}
