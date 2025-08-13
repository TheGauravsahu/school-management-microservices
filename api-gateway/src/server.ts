import helmet from "helmet";
import express, { NextFunction, Request, Response } from "express";
import { env } from "./config/env";
import proxyRoutes from "./routes/proxy";
import logger from "./common/config/logger";
import { requestLogger } from "./common/middlewares/requestLogger";
import { limiter } from "./middleware/rate-limiter.middleware";

const app: express.Application = express();
const PORT = env.PORT;

app.use(helmet());
app.use(limiter);
app.use(requestLogger);

// setup proxy routes
app.use(proxyRoutes);

app.use((req: Request, res: Response) => {
  logger.warn(`Resource not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "resource not found" });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error("Unhandled error:", error);
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal Server Error",
    message: error.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  logger.info(`🚀 API Gateway running on port ${PORT}`);
});
