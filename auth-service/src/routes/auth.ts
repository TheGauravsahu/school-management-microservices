import express from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { AuthController } from "../controllers/authController";
import { UserService } from "../services/userService";
import registerValidator from "../validators/register-validator";
import { CredentialService } from "../services/credentialService";
import loginValidator from "../validators/login-validator";
import { TokenService } from "../services/tokenService";
import { RefreshToken } from "../entity/RefreshToken";
import { asyncHandler } from "../../../shared/middlewares/asyncHandler";
import { authorizeRoles } from "./../../../shared/middlewares/authorizeRoles";
import { authenticateToken } from "../../../shared/middlewares/auth";
import { UserRole } from "./../../../shared/types";
import logger from "../config/logger";

const router: express.Router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

const userService = new UserService(userRepository);
const credentialService = new CredentialService();
const tokenService = new TokenService(refreshTokenRepository);

const authController = new AuthController(
  userService,
  logger,
  credentialService,
  tokenService
);

router.post(
  "/register",
  registerValidator,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER]),
  asyncHandler(authController.register.bind(authController))
);

router.post(
  "/login",
  loginValidator,
  asyncHandler(authController.login.bind(authController))
);

router.get(
  "/me",
  authenticateToken,
  asyncHandler(authController.getProfile.bind(authController))
);

router.post(
  "/refresh-token",
  asyncHandler(authController.refresRefreshToken.bind(authController))
);

export default router;
