import "reflect-metadata";

import helmet from "helmet";
import dotenv from "dotenv";
import express, { Application } from "express";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import { errorHandler } from "../../shared/middlewares/errorHandler";
import { requestLogger } from "../../shared/middlewares/requestLogger";

//load environment variables
dotenv.config();

const app: Application = express();

// setup middlewares
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.get("/", (_, res) => {
  res.send("Welcome to Auth service.");
});

app.use("/api/v1/auth", authRouter);

// error handler middleware
app.use(errorHandler);

export default app;
