import { sign, verify } from "jsonwebtoken";
import { env } from "../common//config/env";
import { User } from "../entity/User";
import { Repository } from "typeorm";
import { RefreshToken } from "../entity/RefreshToken";
import { JWTPayload } from "../common/types";
import logger from "../common/config/logger";
import { VerificationToken } from "../entity/VerificationToken";

export class TokenService {
  constructor(
    private refreshTokenRepository: Repository<RefreshToken>,
    private verificationTokenRepository: Repository<VerificationToken>
  ) {}

  // ---------- AUTH TOKENS ----------
  generateAccessToken(payload: JWTPayload) {
    const accessToken = sign(payload, env.ACCESS_TOKEN_SECRET!, {
      issuer: "auth-service",
    });
    return accessToken;
  }

  generateRefreshToken(payload: JWTPayload) {
    const refreshToken = sign(payload, env.REFRESH_TOKEN_SECRET!, {
      issuer: "auth-service",
    });
    return refreshToken;
  }

  async saveRefreshToken(user: User) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // 1Y
    await this.refreshTokenRepository.delete({ user });

    const newRefreshToken = await this.refreshTokenRepository.save({
      user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
      revoked: false,
    });
    return newRefreshToken;
  }

  async verifyRefreshToken(token: string) {
    try {
      const decoded = verify(token, env.REFRESH_TOKEN_SECRET!) as JWTPayload;

      // check if token exists in DB
      const tokenEntity = await this.refreshTokenRepository.findOne({
        where: { revoked: false },
        relations: ["user"],
      });

      if (!tokenEntity || tokenEntity.expiresAt < new Date()) {
        logger.warn("Expired or missing refresh token");
        return null;
      }

      return decoded;
    } catch (error) {
      logger.error("Invalid refresh token", { error });
      return null;
    }
  }

  deleteRefreshToken(tokenId: string) {
    return this.refreshTokenRepository.delete({ id: tokenId });
  }

  // ---------- VERIFICATION TOKENS ----------
  generateVerificationToken(user: User) {
    const token = sign({ userId: user.id }, env.VERIFICATION_TOKEN_SECRET!, {
      expiresIn: "1h",
      issuer: "auth-service",
    });

    return this.verificationTokenRepository.save({
      user,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    });
  }

  async verifyVerificationToken(token: string) {
    try {
      verify(token, env.VERIFICATION_TOKEN_SECRET!) as {
        userId: string;
      };
      const tokenEntity = await this.verificationTokenRepository.findOne({
        where: { token, used: false },
        relations: ["user"],
      });

      if (!tokenEntity || tokenEntity.expiresAt < new Date()) {
        return null;
      }

      return tokenEntity.user;
    } catch (err) {
      logger.error("Invalid verification token", { err });
      return null;
    }
  }

  invalidateVerificationToken(token: string) {
    return this.verificationTokenRepository.update({ token }, { used: true });
  }
}
