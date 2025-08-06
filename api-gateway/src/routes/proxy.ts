import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { Request, Response } from "express";
import { env } from "../config/env";
import logger from "../config/logger";

const router: express.Router = express.Router();

function createServiceProxy(
  targetUrl: string,
  pathRewrite?: Record<string, string>
) {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: pathRewrite || {},
    on: {
      proxyReq: (proxyReq: any, req: any) => {
        logger.info(
          `Proxying request:  ${req.method} ${req.originalUrl} to ${targetUrl}`
        );
        if (req.user) {
          proxyReq.setHeader("x-user-id", req.user.id);
          proxyReq.setHeader("x-user-email", req.user.email);
          proxyReq.setHeader("x-user-role", req.user.role);
        }
      },
      proxyRes: (proxyRes: any, req: Request, res: Response) => {
        logger.info(
          `Response from ${targetUrl}: ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`
        );
      },
      error: (err: Error, req: Request, res: any) => {
        logger.error(`Proxy error for ${req.path}:`, err);
        if (!res.headersSent) {
          res.status(502).json({
            success: false,
            message: "Service unavailable",
            error: err.message || "Bad Gateway",
          });
        }
      },
    },
  });
}

router.use(
  "/api/v1/auth",
  createServiceProxy(env.AUTH_SERVICE_URL!, { "^/": "/api/v1/auth/" })
);

export default router;
