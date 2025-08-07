import { Request, NextFunction, Response } from "express";
import { UserRole } from "../types";

export const authorizeRoles = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req?.user?.role;

    console.log(
      `Authorizing ${req.user?.userId} - ${req.user?.email} with role: ${userRole}`
    );

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied.",
        error: "Forbidden",
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Only Admins can access this resource.`,
        error: "Forbidden",
      });
    }

    next();
    return;
  };
};
