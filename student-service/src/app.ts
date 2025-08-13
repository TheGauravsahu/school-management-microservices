import express, { Application } from "express";
import helmet from "helmet";
import studentRouter from "./routes/student";
import { requestLogger } from "./common/middlewares/requestLogger";
import { errorHandler } from "./common/middlewares/errorHandler";
import { authenticateToken } from "./common/middlewares/auth";
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

app.use("/api/v1/students", authenticateToken, studentRouter);
// app.use("/api/v1/students", studentRouter); // dev-only, remove auth for now

// error handler middleware
app.use(errorHandler);

export default app;
