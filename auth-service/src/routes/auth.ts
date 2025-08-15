import express from "express";
import { AppDataSource } from "../common/config/data-source";
import { User } from "../entity/User";
import { AuthController } from "../controllers/authController";
import { UserService } from "../services/userService";
import registerValidator from "../validators/register-validator";
import { CredentialService } from "../services/credentialService";
import loginValidator from "../validators/login-validator";
import { TokenService } from "../services/tokenService";
import { RefreshToken } from "../entity/RefreshToken";
import { asyncHandler } from "../common/middlewares/asyncHandler";
import { authorizeRoles } from "../common/middlewares/authorizeRoles";
import { authenticateToken } from "../common/middlewares/auth";
import { UserRole } from "../common/types";
import logger from "../common/config/logger";
import validateRequest from "../common/middlewares/validateReq";
import { VerificationToken } from "../entity/VerificationToken";
import { RabbitMQ } from "../common/config/rabbitmq";

const router: express.Router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const verificationTokenRepository =
  AppDataSource.getRepository(VerificationToken);

const userService = new UserService(userRepository);
const credentialService = new CredentialService();
const tokenService = new TokenService(
  refreshTokenRepository,
  verificationTokenRepository
);
const rabbitMQ = new RabbitMQ();

const authController = new AuthController(
  userService,
  logger,
  credentialService,
  tokenService,
  rabbitMQ
);

router.post(
  "/register",
  registerValidator,
  validateRequest,
  authenticateToken,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER]),
  asyncHandler(authController.register.bind(authController))
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  asyncHandler(authController.login.bind(authController))
);

router.post(
  "/verify/send",
  authenticateToken,
  asyncHandler(authController.sendVerification.bind(authController))
);

router.get(
  "/verify/confirm",
  asyncHandler(authController.verifyAccount.bind(authController))
);

router.get(
  "/me",
  authenticateToken,
  asyncHandler(authController.getProfile.bind(authController))
);

router.post(
  "/refresh-token",
  asyncHandler(authController.refreshAccessToken.bind(authController))
);

router.post(
  "/logout",
  authenticateToken,
  asyncHandler(authController.logout.bind(authController))
);

export default router;
