import amqp, { Channel, ChannelModel, ConfirmChannel } from "amqplib";
import { env } from "../env";
import logger from "../logger";
import { EventPayloads, Events } from "./events";

export class RabbitMQ {
  private connection: ChannelModel | null = null;
  private confirmChannel: ConfirmChannel | null = null;

  constructor() {
    if (!env.RABBIT_MQ_URL) {
      throw new Error("RABBIT_MQ_URL is not defined in environment variables");
    }
  }

  async connect(): Promise<ChannelModel> {
    if (this.connection) return this.connection;

    try {
      this.connection = await amqp.connect(env.RABBIT_MQ_URL!);
      logger.info("Connected to RabbitMQ 🚀");

      this.connection.on("error", (err: Error) => {
        logger.info("RabbitMQ connection error:", err);
        this.connection = null;
      });

      this.connection.on("close", () => {
        logger.info("RabbitMQ connection closed");
        this.connection = null;
      });

      return this.connection;
    } catch (error) {
      logger.error("❌ RabbitMQ connection error:", error);
      this.connection = null;
      throw error;
    }
  }

  async getConfirmChannel(): Promise<ConfirmChannel> {
    if (this.confirmChannel) return this.confirmChannel;

    const connection = await this.connect();
    this.confirmChannel = await connection.createConfirmChannel();

    await this.confirmChannel.assertExchange(env.RABBIT_MQ_EXCHANGE!, "topic", {
      durable: true,
    });
    logger.info("Confirm  channela and exchange ready.");

    return this.confirmChannel;
  }

  async publish<E extends Events>(
    routingKey: string,
    message: EventPayloads[E],
    options: { persistent?: boolean; dedupeId?: string } = {}
  ) {
    const channel = await this.getConfirmChannel();
    const msgBuffer = Buffer.from(JSON.stringify(message));

    channel.publish(env.RABBIT_MQ_EXCHANGE!, routingKey, msgBuffer, {
      persistent: options.persistent ?? true,
      messageId: options.dedupeId,
      contentType: "application/json",
    });

    await channel.waitForConfirms();
    logger.info(`✅ Published to ${routingKey}`);
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      logger.info("Disconnected from RabbitMQ");
      this.connection = null;
    } else {
      logger.info("No RabbitMQ connection to disconnect");
    }
  }

  async createChannel(): Promise<Channel> {
    const connection = await this.connect();
    const channel = await connection.createChannel();
    logger.info("RabbitMQ channel created");
    return channel;
  }
}
