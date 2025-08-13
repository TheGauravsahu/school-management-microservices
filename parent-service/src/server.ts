import app from "./app";
import { connectToDb } from "./common/config/db";
import { env } from "./common/config/env";
import logger from "./common/config/logger";

const PORT = env.PORT;

const startServer = async () => {
  try {
    connectToDb();
    app.listen({ port: Number(env.PORT) });
    logger.info(`🚀 Parent service is running on port ${env.PORT}`);
  } catch (error: unknown) {
    logger.error("Error starting parent service", error);
    if (error instanceof Error) {
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};

void startServer();
