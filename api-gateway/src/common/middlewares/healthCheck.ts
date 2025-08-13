import { Request, Response } from "express";

export function healthCheck(req: Request, res: Response) {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
}
