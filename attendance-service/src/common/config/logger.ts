import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  defaultMeta: { service: "attendance-service" },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.align()
      ),
    }),
  ],
});

export default logger;
