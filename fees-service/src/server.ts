import app from "./app";
import { env } from "./common/config/env";
import logger from "./common/config/logger";

const PORT = Number(env.PORT);

const startServer = async () => {
  try {
    app.listen({ port: Number(PORT) });
    logger.info(`🚀 Fees service is running on port ${PORT}`);
  } catch (error: unknown) {
    logger.error("Error starting Fees service", error);
    if (error instanceof Error) {
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};

void startServer();
