import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: ["src/entity/*.{ts,js}"],
  migrations: ["src/migrations/*.{ts,js}"],
  subscribers: [],
});
