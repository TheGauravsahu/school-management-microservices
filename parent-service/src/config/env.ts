import dotenv from "dotenv";

dotenv.config();

const { PORT, DB_URL, ACCESS_TOKEN_SECRET } = process.env;

export const env = {
  PORT,
  DB_URL,
  ACCESS_TOKEN_SECRET,
};
