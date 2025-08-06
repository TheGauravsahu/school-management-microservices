import { sign, verify } from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../entity/User";
import { Repository } from "typeorm";
import { RefreshToken } from "../entity/RefreshToken";
import { JWTPayload } from "../../../shared/types";
import logger from "../config/logger";

export class TokenService {
  constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

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

  saveRefreshToken(user: User) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // 1Y

    const newRefreshToken = this.refreshTokenRepository.save({
      user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });
    return newRefreshToken;
  }

  verifyRefreshToken(token: string): JWTPayload | null {
    try {
      const decoded = verify(token, env.REFRESH_TOKEN_SECRET!) as JWTPayload;
      return decoded;
    } catch (error) {
      logger.error("Invalid refresh token", { error });
      return null;
    }
  }

  deleteRefreshToken(tokenId: string) {
    return this.refreshTokenRepository.delete({ id: tokenId });
  }
}
