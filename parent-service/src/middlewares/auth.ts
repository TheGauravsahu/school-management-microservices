import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JWTPayload } from "../../../shared/types";


export async function authenticateToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (!token) {
    return reply.status(401).send({
      message: "Access token required",
      error: "Unauthorized",
      success: false,
    });
  }

  const jwtSecret = env.ACCESS_TOKEN_SECRET;
  if (!jwtSecret) {
    return reply.status(500).send({
      message: "JWT secret not configured",
      error: "Internal server error",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({
      message: "Invalid or expired token",
      error: (error as Error).message,
      success: false,
    });
  }
}
