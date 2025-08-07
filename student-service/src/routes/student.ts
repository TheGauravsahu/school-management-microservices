import express from "express";
import { validateRequest } from "../validators/validateReq";
import { createStudentSchema } from "../validators/student.validator";
import { StudentService } from "../services/studentService";
import logger from "../config/logger";
import { StudentRepostory } from "../repository/studentRepository";
import { StudentController } from "../controllers/studentController";
import { authorizeRoles } from "./../../../shared/middlewares/authorizeRoles";
import { asyncHandler } from "../../../shared/middlewares/asyncHandler";
import { authenticateToken } from "../../../shared/middlewares/auth";
import { UserRole } from "../../../shared/types";

const router: express.Router = express.Router();

const studentRepository = new StudentRepostory(logger);
const studentService = new StudentService(studentRepository, logger);
const studentController = new StudentController(studentService, logger);

router.post(
  "/",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER]),
  validateRequest(createStudentSchema),
  asyncHandler(studentController.createStudent.bind(studentController))
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER]),
  asyncHandler(studentController.getAllStudents.bind(studentController))
);

export default router;
