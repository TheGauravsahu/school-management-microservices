import express, { Application } from "express";
import helmet from "helmet";
import studentRouter from "./routes/student";
import { requestLogger } from "../../shared/middlewares/requestLogger";
import { errorHandler } from "../../shared/middlewares/errorHandler";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// setup middlewares
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get("/", (_, res) => {
  res.send("Welcome to Student service.");
});

app.use("/api/v1/students", studentRouter);

// error handler middleware
app.use(errorHandler);

export default app;
