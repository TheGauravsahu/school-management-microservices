import Fastify from "fastify";
import ajvErrors from "ajv-errors";
import teacherRouter from "./routes/teacher";

const app = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      allErrors: true,
    },
    plugins: [ajvErrors],
  },
});

app.register(teacherRouter, { prefix: "/api/v1/teachers" });

app.setErrorHandler((error, req, reply) => {
  if (error.validation) {
    const errors = error.validation.map((err) => {
      let field = "";

      if (
        err.keyword === "errorMessage" &&
        Array.isArray((err.params as any).errors)
      ) {
        const originalError = (err.params as any).errors[0];
        if (
          originalError.keyword === "required" &&
          originalError.params?.missingProperty
        ) {
          field = originalError.params.missingProperty;
        } else {
          field = originalError.instancePath.replace(/^\//, "");
        }
      } else {
        field = err.instancePath.replace(/^\//, "");
        if (
          err.keyword === "required" &&
          (err.params as any)?.missingProperty
        ) {
          field = (err.params as { missingProperty: string }).missingProperty;
        }
      }

      return {
        field,
        message: err.message || "Invalid value",
      };
    });

    return reply.status(400).send({
      success: false,
      message: "Validation error",
      errors,
    });
  }

  return reply.status(error.statusCode || 500).send({
    success: false,
    message: error.message || "Internal Server Error",
    error: error.message,
    data_from: "TEACHER_SERVICE",
  });
});

export default app;
