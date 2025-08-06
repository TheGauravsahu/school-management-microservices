import app from "./app";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";
import logger from "./config/logger";


const startServer = async () => {
  const PORT = env.PORT;
  try {
    await AppDataSource.initialize();
    logger.info("Database connection established successfully");
    app.listen(PORT, () =>
      logger.info(`Auth Service is running on port ${PORT}`)
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error starting Auth Service: ${error.message}`);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};

void startServer();
