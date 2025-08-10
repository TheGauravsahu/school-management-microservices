import { FastifyReply, FastifyRequest } from "fastify";
import { UserRole } from "../../../shared/types";

export function authorizeRoles(allowedRoles: UserRole[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const userRole = req?.user?.role;

    if (!userRole) {
      return reply.status(403).send({
        success: false,
        message: "Forbidden: Access denied.",
        error: "Forbidden",
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return reply.status(403).send({
        success: false,
        message: `Forbidden: Only [${allowedRoles.join(
          ", "
        )}] can access this resource.`,
        error: "Forbidden",
      });
    }
  };
}
