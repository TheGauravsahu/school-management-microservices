import dotenv from "dotenv";

dotenv.config();

const {
  ACCESS_TOKEN_SECRET,
  PORT,
  DB_URL,
  RABBIT_MQ_URL,
  RABBIT_MQ_EXCHANGE,
  EMAIL_QUEUE,
  PREFETCH,
} = process.env;

export const env = {
  ACCESS_TOKEN_SECRET,
  PORT,
  DB_URL,
  RABBIT_MQ_URL,
  RABBIT_MQ_EXCHANGE,
  EMAIL_QUEUE,
  PREFETCH,
};
