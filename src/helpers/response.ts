import { Response } from "express";

export const apiResponse = {
  success: <T>(res: Response, data: T, message?: string) => {
    res.status(200).json({
      success: true,
      message: message || "Data fetched successfully",
      data,
    });
  },
  created: <T>(res: Response, data: T, message?: string) => {
    res.status(201).json({
      success: true,
      message: message || "Data created successfully",
      data,
    });
  },
  updated: <T>(res: Response, data: T, message?: string) => {
    res.status(200).json({
      success: true,
      message: message || "Data updated successfully",
      data,
    });
  },
  deleted: (res: Response, message?: string) => {
    res.status(204).json({
      success: true,
      message: message || "Data deleted successfully",
    });
  },
  error: <E>(
    res: Response,
    message = "error",
    errors?: E,
    statusCode = 500,
  ) => {
    res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  },
};
