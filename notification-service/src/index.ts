import { env } from "./common/config/env";
import logger from "./common/config/logger";
import { startEmailConsumer } from "./workers/emailWoker";

async function start() {
  logger.info("Starting Notification Service");
  await startEmailConsumer();
}

start().catch((err) => {
  logger.error("Failed to start service", err);
  process.exit(1);
});
