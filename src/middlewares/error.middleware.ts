import { NextFunction, Request, Response } from "express";
import { AppError, ErrorMessage } from "../helpers/error";
import { apiResponse } from "../helpers/response";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    apiResponse.error(res, err.message, null, err.statusCode);
    return;
  }

  console.log("Unexpected Error: ", err);
  apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
};
