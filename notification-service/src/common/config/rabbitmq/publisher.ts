import { RabbitMQ } from ".";
import { env } from "../env";

const rabbitMq = new RabbitMQ();

export async function publishToQueue(
  routingKey: string,
  message: any,
  options: { persistent?: boolean; dedupeId?: string } = {}
) {
  const channel = await rabbitMq.createChannel();
  await channel.assertExchange(env.RABBIT_MQ_EXCHANGE!, "topic", {
    durable: true,
  });
  const msgBuffer = Buffer.from(JSON.stringify(message));

  // confirm channel -> guaranteed delivery
  const connection = await rabbitMq.connect();
  const confirmChannel = await connection.createConfirmChannel();
  confirmChannel.publish(env.RABBIT_MQ_EXCHANGE!, routingKey, msgBuffer, {
    persistent: options.persistent ?? true,
    messageId: options.dedupeId,
    contentType: "application/json",
  });

  await confirmChannel.waitForConfirms();
  console.log(`Message published to queue with routing key: ${routingKey}`);

  await confirmChannel.close();
  await channel.close();
}
