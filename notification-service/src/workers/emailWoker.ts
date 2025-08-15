import { ConsumeMessage } from "amqplib";
import nodemailer from "nodemailer";
import { env } from "../common/config/env";
import { RabbitMQ } from "../common/config/rabbitmq";
import logger from "../common/config/logger";
import { Events, EventPayloads } from "../common/config/rabbitmq/events";

const rabbitMq = new RabbitMQ();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

async function sendEmail(to: string, subject: string, html: string) {
  logger.info(`Email sent to: ${to}`);
  return transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}

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
    const data = JSON.parse(msg.content.toString()) as EventPayloads[Events];
    logger.info(`Received: ${routingKey}`, data);

    try {
      switch (routingKey) {
        case Events.STUDENT_CREATED: {
          break;
        }

        case Events.TEACHER_CREATED: {
          const { email, firstName, lastName } =
            data as EventPayloads[Events.TEACHER_CREATED];
          const html = `<p>Hello ${firstName} ${lastName},</p><p>You have been registered as a teacher.</p>`;
          await sendEmail(email, "Teacher Account Created", html);
          break;
        }

        case Events.EMAIL_VERIFICATION: {
          const { name, email, role, verificationToken } =
            data as EventPayloads[Events.EMAIL_VERIFICATION];
          const accountType =
            role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
          const link = `${env.AUTH_SERVICE_URL}/api/v1/auth/verify/confirm?token=${verificationToken}`;

          const html = `<p>Hello ${name},</p>
                <p>Your ${accountType} account has been created.</p>
                <p><a href="${link}">Click here</a> to set your password and activate your account.</p>`;

          await sendEmail(email, `Activate Your ${accountType} Account`, html);
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
