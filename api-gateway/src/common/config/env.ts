import dotenv from "dotenv";

dotenv.config();

const { ACCESS_TOKEN_SECRET, AUTH_SERVICE_URL, STUDENT_SERVICE_URL } =
  process.env;

export const env = {
  ACCESS_TOKEN_SECRET,
  AUTH_SERVICE_URL,
  STUDENT_SERVICE_URL,
};
