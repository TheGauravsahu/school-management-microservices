import { ConsumeMessage } from "amqplib";
import { env } from "../common/config/env";
import { RabbitMQ } from "../common/config/rabbitmq";
import logger from "../common/config/logger";
import { Events, EventPayloads } from "../common/config/rabbitmq/events";
import { handleStudentCreated } from "./handlers/studentHandler";
import { handleTeacherCreated } from "./handlers/teacherHandler";
import { handleEmailVerificationEvent } from "./handlers/emailVerificationHandler";
import { handleStudentAbsent } from "./handlers/studentAbsentHandler";
import { handleInvoiceCreated } from "./handlers/invoiceHandler";

const rabbitMq = new RabbitMQ();

export async function startEmailConsumer(handleConcurrency = 3) {
  const conn = await rabbitMq.connect();
  const channel = await conn.createChannel();

  await channel.assertExchange(env.RABBIT_MQ_EXCHANGE!, "topic", {
    durable: true,
  });
  const { queue } = await channel.assertQueue(env.EMAIL_QUEUE!, {
    durable: true,
  });

  // listen to all events
  await channel.bindQueue(queue, env.RABBIT_MQ_EXCHANGE!, "#");

  channel.prefetch(handleConcurrency);

  logger.info("Email consumer started");

  channel.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;
    const routingKey = msg.fields.routingKey as Events;
    const data = JSON.parse(msg.content.toString());
    logger.info(`Received: ${routingKey}`, data);

    try {
      switch (routingKey) {
        case Events.STUDENT_CREATED: {
          await handleStudentCreated(data);
          break;
        }
        case Events.TEACHER_CREATED: {
          await handleTeacherCreated(data);
          break;
        }
        case Events.EMAIL_VERIFICATION: {
          await handleEmailVerificationEvent(data);
          break;
        }
        case Events.STUDENT_ABSENT: {
          await handleStudentAbsent(data);
          break;
        }
        case Events.INVOICE_CREATED:{
          await handleInvoiceCreated(data);
          break;
        }
      }
      channel.ack(msg);
    } catch (error) {
      logger.error("Email worker error", error);
      channel.nack(msg, false, false);
    }
  });

  const shutdown = async () => {
    console.log("Shutting down email consumer...");
    await channel.close();
    await conn.close();
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
