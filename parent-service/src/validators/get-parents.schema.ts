import { FastifySchema } from "fastify";

export const getParentsQuerySchema: FastifySchema = {
  querystring: {
    type: "object",
    properties: {
      page: { type: "integer", minimum: 1 },
      limit: { type: "integer", minimum: 1 },
      skip: { type: "integer", minimum: 0 },
      exportMode: { type: "boolean" },
    },
    additionalProperties: false,
  },
};
