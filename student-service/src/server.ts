import app from "./app";
import { connectToDb } from "./config/db";
import { env } from "./config/env";
import logger from "./config/logger";


const PORT = env.PORT;

const startServer = async () => {
  try {
    await connectToDb();
    app.listen(PORT, () =>
      logger.info(`Student Service is running on port ${PORT}`)
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error starting server: ${error.message}`);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};

void startServer();
