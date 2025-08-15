import { ConsumeMessage } from "amqplib";
import { env } from "../common/config/env";
import { RabbitMQ } from "../common/config/rabbitmq";
import logger from "../common/config/logger";
import { Events, EventPayloads } from "../common/config/rabbitmq/events";
import { AppDataSource } from "../common/config/data-source";
import { User } from "../entity/User";
import { RefreshToken } from "../entity/RefreshToken";
import { UserService } from "../services/userService";
import { TokenService } from "../services/tokenService";
import { UserRole } from "../common/types";
import { VerificationToken } from "../entity/VerificationToken";

const rabbitMq = new RabbitMQ();
const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const verificationTokenRepository =
  AppDataSource.getRepository(VerificationToken);

const userService = new UserService(userRepository);
const tokenService = new TokenService(
  refreshTokenRepository,
  verificationTokenRepository
);

export async function startAuthConsumer() {
  const conn = await rabbitMq.connect();
  const channel = await conn.createChannel();

  await channel.assertExchange(env.RABBIT_MQ_EXCHANGE!, "topic", {
    durable: true,
  });
  const { queue } = await channel.assertQueue(env.AUTH_QUEUE!, {
    durable: true,
  });

  // listen to all events
  await channel.bindQueue(queue, env.RABBIT_MQ_EXCHANGE!, "#");

  logger.info("Auth consumer started");

  channel.consume(env.AUTH_QUEUE!, async (msg: ConsumeMessage | null) => {
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
          const { email, teacherId, firstName, lastName } =
            data as EventPayloads[Events.TEACHER_CREATED];

          // create user
          const user = await userService.save({
            name: `${firstName} ${lastName}`,
            email,
            password: undefined,
            role: UserRole.TEACHER,
            externalId: teacherId,
          });

          // generate one-time verification token
          const { token } = await tokenService.generateVerificationToken(user);

          // publish EMAIL_VERIFICATION event
          await rabbitMq.publish<Events.EMAIL_VERIFICATION>(
            Events.EMAIL_VERIFICATION,
            {
              name: `${firstName} ${lastName}`,
              email,
              role: UserRole.TEACHER,
              verificationToken: token,
            }
          );

          break;
        }
      }
      channel.ack(msg);
    } catch (error) {
      logger.error("Auth consumer error", error);
      channel.nack(msg, false, false);
    }
  });

  const shutdown = async () => {
    console.log("Shutting down Auth consumer...");
    await channel.close();
    await conn.close();
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
