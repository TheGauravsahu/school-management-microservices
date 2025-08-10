import { Logger } from "winston";
import { Request, NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CredentialService } from "../services/credentialService";
import { UserService } from "../services/userService";
import { TokenService } from "../services/tokenService";
import { env } from "../config/env";
import { JWTPayload } from "../../../shared/types";

const SERVICE_NAME = "AUTH_SERVICE";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private credentialService: CredentialService,
    private tokenService: TokenService
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    // validate request body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: result.array(),
      });
    }

    const { email, password, role } = req.body;
    this.logger.debug("Registering user", { email, role, password: "******" });

    try {
      const user = await this.userService.create({
        email,
        password,
        role,
      });
      this.logger.info("User has been registered", { id: user.id });

      const accessTokenJwtPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
        iat: Math.floor(Date.now() / 1000), // issued at time
      };
      const accessToken = this.tokenService.generateAccessToken(
        accessTokenJwtPayload
      );

      // save refresh toeken to db
      const newRefreshToken = await this.tokenService.saveRefreshToken(user);

      const refreshTokenJwtPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
        iat: Math.floor(Date.now() / 1000), // issued at time
      };
      const refreshToken = this.tokenService.generateRefreshToken({
        ...refreshTokenJwtPayload,
        jti: newRefreshToken.id,
      });

      res.cookie("accessToken", accessToken, {
        domain: env.MAIN_DOMAIN,
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1d
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: env.MAIN_DOMAIN,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
        httpOnly: true, // Very important
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: { id: user.id },
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
    // validate request body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { email, password } = req.body;

    this.logger.debug("New request to login a user", {
      email,
      password: "******",
    });

    try {
      const user = await this.userService.findByEmailWithPassword(email);
      if (!user) {
        this.logger.warn("User not found", { email });
        const error = createHttpError(404, "User not found");
        next(error);
        return;
      }

      const passwordMatch = await this.credentialService.comparePassword(
        password,
        user.password
      );
      if (!passwordMatch) {
        this.logger.warn("Invalid password for user", { email });
        const error = createHttpError(401, "Invalid credentials");
        next(error);
        return;
      }

      const jwtPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
        iat: Math.floor(Date.now() / 1000), // issued at time
      };
      const accessToken = this.tokenService.generateAccessToken(jwtPayload);

      // save refresh toeken
      const newRefreshToken = await this.tokenService.saveRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...jwtPayload,
        jti: newRefreshToken.id,
      });

      res.cookie("accessToken", accessToken, {
        domain: env.MAIN_DOMAIN,
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1d
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: env.MAIN_DOMAIN,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
        httpOnly: true, // Very important
      });

      this.logger.info("User has been logged in", { id: user.id });
      return res.json({
        success: true,
        message: "User logged in successfully",
        data: { id: user.id },
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    const userId = req?.user?.userId;
    this.logger.debug("Fetching user details", { userId });

    try {
      const user = await this.userService.findById(userId as string);
      if (!user) {
        this.logger.warn("User not found", { userId });
        const error = createHttpError(404, "User not found");
        next(error);
        return;
      }

      return res.json({
        success: true,
        message: "User details fetched successfully",
        data: { id: user.id, email: user.email, role: user.role },
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
    let refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      // 1. Custom header
      refreshToken = req.header("x-refresh-token");

      // 2. Or from Authorization header: "Bearer <token>"
      if (!refreshToken) {
        const authHeader = req.header("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          refreshToken = authHeader.substring(7); // remove "Bearer "
        }
      }
    }

    if (!refreshToken) {
      this.logger.warn("Refresh token not provided");
      return next(createHttpError(401, "Refresh token required"));
    }

    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      const user = await this.userService.findById(payload?.userId as string);
      if (!user) {
        this.logger.warn("User not found for refresh token", {
          userId: payload?.userId,
        });
        const error = createHttpError(404, "User not found");
        next(error);
        return;
      }

      const newAccessToken = this.tokenService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
        iat: Math.floor(Date.now() / 1000), // issued at time
      });

      res.cookie("accessToken", newAccessToken, {
        domain: env.MAIN_DOMAIN,
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1d
        httpOnly: true,
      });

      return res.json({
        success: true,
        message: "Access token refreshed successfully",
        data: { accessToken: newAccessToken },
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error refreshing access token", { error });
      next(error);
      return;
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const refreshToken =
      req.cookies.refreshToken || req.headers["x-refresh-token"];
    if (!refreshToken) {
      this.logger.warn("Refresh token not provided for logout");
      next(createHttpError(401, "Refresh token required"));
      return;
    }
    this.logger.debug("Logging out user", { refreshToken });
    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      if (!payload) {
        next(createHttpError(401, "Invalid refresh token"));
        return;
      }

      const user = await this.userService.findById(payload.userId);
      if (!user) {
        this.logger.warn("User not found for logout", {
          userId: payload.userId,
        });
        next(createHttpError(404, "User not found"));
        return;
      }

      // Delete the refresh token from the DB
      await this.tokenService.deleteRefreshToken(payload.tokenId);

      // Optionally clear cookies
      res.clearCookie("refreshToken");

      return res.status(200).json({
        success: true,
        message: "User logged out successfully",
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error during logout", { error });
      next(error);
      return;
    }
  }
}
