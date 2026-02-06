export enum ErrorMessage {
  INVALID_INPUT = "Invalid input provided.",
  NOT_FOUND = "The requested resource was not found.",
  UNAUTHORIZED = "You are not authorized to perform this action.",
  INTERNAL_SERVER_ERROR = "An internal server error occurred.",
  BAD_REQUEST = "Bad request.",
  WRONG_CREDENTIALS = "Incorrect email or password.",
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
