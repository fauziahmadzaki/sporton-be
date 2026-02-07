import { Request, Response } from "express";
import { apiResponse } from "../helpers/response";
import { safeParse } from "zod";
import {
  initiateAdminUserSchema,
  signinSchema,
} from "../validators/auth.validator";
import { registerAdminService, signinService } from "../services/auth.services";
import { AppError, ErrorMessage } from "../helpers/error";

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = safeParse(signinSchema, req.body);

    if (!parsed.success) {
      apiResponse.error(
        res,
        "Bad Request",
        parsed.error.flatten().fieldErrors,
        400,
      );
      return;
    }

    const data = await signinService(parsed.data.email, parsed.data.password);

    apiResponse.success(res, data);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, null, error.statusCode);
      return;
    }

    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
  }
};

export const initiateAdminUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = safeParse(initiateAdminUserSchema, req.body);
    if (!parsed.success) {
      apiResponse.error(
        res,
        ErrorMessage.BAD_REQUEST,
        parsed.error.flatten().fieldErrors,
        400,
      );
      return;
    }

    const data = await registerAdminService(
      parsed.data.email,
      parsed.data.password,
      parsed.data.name,
    );
    apiResponse.success(res, data);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, null, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
  }
};
