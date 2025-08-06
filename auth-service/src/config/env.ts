import { config } from "dotenv";
import path from "path";

config({
  path: path.join(__dirname, "../../.env"),
});

const {
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  MAIN_DOMAIN,
} = process.env;

export const env = {
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  MAIN_DOMAIN,
};
