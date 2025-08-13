import amqp, { Channel, ChannelModel } from "amqplib";
import { env } from "../env";

export class RabbitMQ {
  private connection: ChannelModel | null = null;

  constructor() {
    if (!env.RABBIT_MQ_URL) {
      throw new Error("RABBIT_MQ_URL is not defined in environment variables");
    }
  }

  async connect(): Promise<ChannelModel> {
    if (this.connection) return this.connection;

    try {
      this.connection = await amqp.connect(env.RABBIT_MQ_URL!);
      console.log("Connected to RabbitMQ 🚀");

      this.connection.on("error", (err: Error) => {
        console.log("RabbitMQ connection error:", err);
        this.connection = null;
      });

      this.connection.on("close", () => {
        console.log("RabbitMQ connection closed");
        this.connection = null;
      });

      return this.connection;
    } catch (error) {
      console.log("❌ RabbitMQ connection error:", error);
      this.connection = null;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      console.log("Disconnected from RabbitMQ");
      this.connection = null;
    } else {
     console.log("No RabbitMQ connection to disconnect");
    }
  }

  async createChannel(): Promise<Channel> {
    const connection = await this.connect();
    const channel = await connection.createChannel();
    console.log("RabbitMQ channel created");
    return channel;
  }
}
