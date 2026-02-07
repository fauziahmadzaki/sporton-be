import { Request, Response } from "express";
import { apiResponse } from "../helpers/response";
import { AppError, ErrorMessage } from "../helpers/error";
import { safeParse } from "zod";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
} from "../services/category.services";
import { CategoryType } from "../types";

export const createCategory = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      apiResponse.error(res, ErrorMessage.INVALID_INPUT, null, 400);
      return;
    }

    const parsed = safeParse(createCategorySchema, req.body);
    if (!parsed.success) {
      apiResponse.error(
        res,
        ErrorMessage.BAD_REQUEST,
        parsed.error.flatten().fieldErrors,
        400,
      );
      return;
    }

    const {
      data: { name, description },
    } = parsed;

    const imagePath = `uploads/${req.file.filename}`;

    const payload = { name, description, imageUrl: imagePath };

    const category = await createCategoryService(payload);

    apiResponse.created(res, category);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, null, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parsed = safeParse(updateCategorySchema, req.body);
    if (!parsed.success) {
      apiResponse.error(
        res,
        ErrorMessage.BAD_REQUEST,
        parsed.error.flatten().fieldErrors,
        400,
      );
      return;
    }

    const payload: Partial<CategoryType> = {
      name: parsed.data.name,
      description: parsed.data.description,
    };

    if (req.file) {
      payload.imageUrl = `uploads/${req.file.filename}`;
    }

    const updatedCategory = await updateCategoryService(id as string, payload);

    apiResponse.updated(res, updatedCategory);
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, null, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategoriesService(req.query);
    apiResponse.success(res, categories);
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, null, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
  }
};

export const getByCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await getCategoryByIdService(id as string);
    apiResponse.success(res, category);
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, null, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteCategoryService(id as string);

    apiResponse.deleted(res);
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, null, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
  }
};
