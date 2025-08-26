import { ConsumeMessage } from "amqplib";
import { env } from "../common/config/env";
import logger from "../common/config/logger";
import { RabbitMQ } from "../common/config/rabbitmq";
import { EventPayloads, Events } from "../common/config/rabbitmq/events";
import { db } from "../common/config/db";

const rabbitMQ = new RabbitMQ();

export async function startStudentConsumer() {
  const conn = await rabbitMQ.connect();
  const channel = await conn.createChannel();

  await channel.assertExchange(env.RABBIT_MQ_EXCHANGE!, "topic", {
    durable: true,
  });
  const { queue } = await channel.assertQueue(env.FEES_QUEUE!, {
    durable: true,
  });

  await channel.bindQueue(
    queue,
    env.RABBIT_MQ_EXCHANGE!,
    Events.STUDENT_CREATED
  );

  logger.info("Student cache consumer started");

  channel.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;
    const data = JSON.parse(
      msg.content.toString()
    ) as EventPayloads[Events.STUDENT_CREATED];
    logger.info("Recieved student data", data);

    try {
      await db.studentCache.upsert({
        where: { id: data._id },
        create: {
          id: data._id,
          name: data.name,
          email: data.email,
          rollNo: data.rollNumber,
          mobileNumber: data.mobileNumber,
          class: data.class,
        },
        update: {
          name: data.name,
          email: data.email,
        },
      });

      channel.ack(msg);
    } catch (error) {
      logger.error("Error updating StudentCache", error);
      channel.nack(msg, false, true); // requeue if fails
    }
  });
}
