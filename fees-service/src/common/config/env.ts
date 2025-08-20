import dotenv from "dotenv";

dotenv.config();

const {
  PORT,
  NODE_ENV,
  ACCESS_TOKEN_SECRET,
  RABBIT_MQ_URL,
  RABBIT_MQ_EXCHANGE,
  ATTENDENCE_QUEUE,
  PREFETCH,
} = process.env;

export const env = {
  PORT,
  NODE_ENV,
  ACCESS_TOKEN_SECRET,
  RABBIT_MQ_URL,
  RABBIT_MQ_EXCHANGE,
  ATTENDENCE_QUEUE,
  PREFETCH,
};
