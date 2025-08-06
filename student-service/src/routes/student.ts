import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

const router = express.Router();

router.post("/students", (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {}) as RequestHandler);
