import app from "./app";
import { env } from "./common/config/env";
import logger from "./common/config/logger";
import { AppDataSource } from "./common/config/data-source";

const PORT = Number(env.PORT);

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connection established successfully");
    app.listen({ port: Number(PORT) });
    logger.info(`🚀 Attendance service is running on port ${PORT}`);
  } catch (error: unknown) {
    logger.error("Error starting Attendance service", error);
    if (error instanceof Error) {
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};

void startServer();
