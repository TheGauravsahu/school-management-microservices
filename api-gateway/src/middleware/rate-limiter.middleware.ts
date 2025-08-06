import rateLimit from "express-rate-limit";
import { env } from "../config/env";

export const limiter = rateLimit({
  skip: (req, res) => {
    return env.NODE_ENV !== "production";
  },
  windowMs: 15 * 60 * 1000,
  max: 100,
});
