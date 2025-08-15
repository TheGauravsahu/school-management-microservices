import { Logger } from "winston";
import { Request, NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import createHttpError from "http-errors";
import { CredentialService } from "../services/credentialService";
import { UserService } from "../services/userService";
import { TokenService } from "../services/tokenService";
import { env } from "../common/config/env";
import { JWTPayload } from "../common/types";
import { RabbitMQ } from "../common/config/rabbitmq";
import {  Events } from "../common/config/rabbitmq/events";

const SERVICE_NAME = "AUTH_SERVICE";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private credentialService: CredentialService,
    private tokenService: TokenService,
    private rabitMq: RabbitMQ
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const { name, email, password, role, externalId } = req.body;
    this.logger.debug("Registering user", { email, role, password: "******" });

    try {
      const user = await this.userService.create({
        name,
        email,
        password,
        role,
        externalId,
      });
      this.logger.info("User has been registered", { id: user.id });

      // pulish event
      const { token, expiresAt } =
        await this.tokenService.generateVerificationToken(user);
      this.logger.info(
        `Verification token for ${user.email} - ${user.role} has been generated ${token}. Expires At: ${expiresAt}`
      );
      this.rabitMq.publish<Events.EMAIL_VERIFICATION>(
        Events.EMAIL_VERIFICATION,
        {
          name,
          email,
          role,
          verificationToken: token,
        }
      );

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
        password!,
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
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);
      const user = await this.userService.findById(
        payload?.userId as string
      );
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
      return next(createHttpError(401, "Refresh token required"));
    }

    this.logger.debug("Logging out user", { refreshToken });
    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);
      if (!payload) return next(createHttpError(401, "Invalid refresh token"));

      await this.tokenService.deleteRefreshToken(payload.jti!);

      res.clearCookie("refreshToken", { domain: env.MAIN_DOMAIN });
      res.clearCookie("accessToken", { domain: env.MAIN_DOMAIN });

      this.logger.info("User logged out", { userId: payload.userId });

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

  async sendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const user = await this.userService.findByIdNotActivated(userId!);
      if (!user) return next(createHttpError(404, "User not found"));

      if (user.isActivated) {
        return res.json({ success: true, message: "Already verified" });
      }
      // pulish event
      const verificationToken =
        await this.tokenService.generateVerificationToken(user);

      this.rabitMq.publish<Events.EMAIL_VERIFICATION>(
        Events.EMAIL_VERIFICATION,
        {
          name: user.name,
          email: user.email,
          role: user.role,
          verificationToken: verificationToken.token,
        }
      );

      this.logger.info("Verification email sent", { email: user.email });

      return res.json({
        success: true,
        message: "Verification email sent",
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query;
      const user = await this.tokenService.verifyVerificationToken(
        token as string
      );

      if (!user) return next(createHttpError(400, "Invalid or expired token"));

      user.isActivated = true;
      await this.userService.save(user);
      await this.tokenService.invalidateVerificationToken(token as string);

      this.logger.info("User account activated", { userId: user.id });

      return res.json({
        success: true,
        message: "Account verified successfully",
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      return next(error);
    }
  }
}
