import { Request, Response, NextFunction } from 'express';

/**
 * Request Logger Middleware
 * Logs details about incoming HTTP requests, including request start time and response duration.
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction to pass control to the next middleware.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  // Get the current timestamp for when the request was received
  const requestTimestamp = new Date().toISOString();

  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress; // Get client IP address

  console.log(`[${requestTimestamp}] ${method} ${url} - IP: ${ip} - Request received`);

  // This event is emitted when the response has been sent to the client
  res.on('finish', () => {
    const end = Date.now();
    const duration = end - start; // Calculate the duration in milliseconds
    const responseTimestamp = new Date().toISOString(); // Timestamp for when the response finished

     console.log(`[${responseTimestamp}] ${method} ${url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
  });

  next();
}
