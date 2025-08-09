import {  ConsumeMessage } from "amqplib";
import nodemailer from "nodemailer";
import { env } from "../config/env";
import { RabbitMQ } from "../queues/rabbitmq";
import logger from "../config/logger";

const rabbitMq = new RabbitMQ();

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST!,
  port: Number(env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

async function sendEmail(to: string, subject: string, html: string) {
  return transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}

export async function startEmailConsumer(handleConcurrency = 3) {
  const conn = await rabbitMq.connect();
  const channel = await conn.createChannel();

  await channel.assertExchange(env.RABBIT_MQ_EXCHANGE!, "topic", {
    durable: true,
  });
  await channel.assertQueue(env.EMAIL_QUEUE!, { durable: true });
  await channel.bindQueue(
    env.EMAIL_QUEUE!,
    env.RABBIT_MQ_EXCHANGE!,
    "student.*"
  ); // add keys
  channel.prefetch(handleConcurrency);

  logger.info("Email consumer started");

  channel.consume(env.EMAIL_QUEUE!, async (msg: ConsumeMessage | null) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());
      const { email, subject, templateData } = payload;
      const html = `<p>Hello ${templateData.name}</p><p>Welcome!</p>`;

      await sendEmail(email, subject || "Notification", html);
      channel.ack(msg);
    } catch (error) {
      logger.error("Email worker error", error);
      channel.nack(msg, false, false);
    }
    {
      noAck: false;
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
