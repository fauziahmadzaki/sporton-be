import { Response } from "express";

interface ApiResponse<T, E> {
  success: boolean;
  message: string;
  data?: T;
  errors?: E;
}

export const apiResponse = {
  success: <T>(
    res: Response,
    message = "success",
    data: T,
    statusCode = 200,
  ) => {
    const response: ApiResponse<T, null> = {
      success: true,
      message,
      data,
    };
    res.status(statusCode).json(response);
  },
  error: <E>(
    res: Response,
    message = "error",
    errors?: E,
    statusCode = 500,
  ) => {
    const response: ApiResponse<null, E> = {
      success: false,
      message,
      errors,
    };
    res.status(statusCode).json(response);
  },
};
