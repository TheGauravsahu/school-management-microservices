import { config } from "dotenv";
import path from "path";

config({
  path: path.join(__dirname, "../../.env"),
});

const {
  PORT,
  AUTH_SERVICE_URL,
  STUDENT_SERVICE_URL,
  ADMIN_SERVICE_URL,
  NODE_ENV,
} = process.env;

export const env = {
  PORT,
  AUTH_SERVICE_URL,
  STUDENT_SERVICE_URL,
  ADMIN_SERVICE_URL,
  NODE_ENV,
};
