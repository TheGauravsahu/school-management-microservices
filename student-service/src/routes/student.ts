import express from "express";
import { validateRequest } from "../validators/validateReq";
import { createStudentSchema } from "../validators/student.validator";
import { StudentService } from "../services/studentService";
import logger from "../config/logger";
import { StudentRepostory } from "../repository/studentRepository";
import { StudentController } from "../controllers/studentController";
import { authorizeRoles } from "./../../../shared/middlewares/authorizeRoles";
import { asyncHandler } from "../../../shared/middlewares/asyncHandler";
import { UserRole } from "../../../shared/types";

const router: express.Router = express.Router();

const studentRepository = new StudentRepostory(logger);
const studentService = new StudentService(studentRepository, logger);
const studentController = new StudentController(studentService, logger);

router.post(
  "/",
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER]),
  validateRequest(createStudentSchema),
  asyncHandler(studentController.createStudent.bind(studentController))
);

router.get(
  "/",
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER]),
  asyncHandler(studentController.getAllStudents.bind(studentController))
);

router.get(
  "/:id",
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER]),
  asyncHandler(studentController.getStudentById.bind(studentController))
);

router.get(
  "/me",
  authorizeRoles([UserRole.STUDENT]),
  asyncHandler(studentController.getStudentByUserId.bind(studentController))
); // for logged-in student

router.get(
  "/parent/:parentId",
  authorizeRoles([UserRole.PARENT, UserRole.ADMIN, UserRole.TEACHER]),
  asyncHandler(studentController.getStudentsByParentId.bind(studentController))
);

router.put(
  "/:id",
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER]),
  validateRequest(createStudentSchema),
  asyncHandler(studentController.updateStudent.bind(studentController))
);

router.delete(
  "/:id",
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(studentController.deleteStudent.bind(studentController))
);

export default router;
