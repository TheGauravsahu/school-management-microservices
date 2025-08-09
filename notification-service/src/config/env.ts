import dotenv from "dotenv";
dotenv.config();

const {
  RABBIT_MQ_URL,
  RABBIT_MQ_EXCHANGE,
  EMAIL_QUEUE,
  PREFETCH,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
} = process.env;

export const env = {
  RABBIT_MQ_URL,
  RABBIT_MQ_EXCHANGE,
  EMAIL_QUEUE,
  PREFETCH,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
};
