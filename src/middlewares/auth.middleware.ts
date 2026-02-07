import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { apiResponse } from "../helpers/response";
import { ErrorMessage } from "../helpers/error";

const JWT_SECRET = process.env.JWT_SECRET || "";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    apiResponse.error(res, ErrorMessage.UNAUTHORIZED, null, 401);
    return;
  }

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    apiResponse.error(res, "Invalid or expired token", 401);
  }
};
