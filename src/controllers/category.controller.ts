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
  getCategoryByIdService,
} from "../services/category.services";
import categoryModel from "../models/category.model";
import fs from "fs";

export const createCategory = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      apiResponse.error(res, ErrorMessage.INVALID_INPUT, 400);
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

    const category = await createCategoryService(name, description, imagePath);

    apiResponse.success(res, "Category created successfully", category, 201);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, 500);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    if (!category) {
      apiResponse.error(res, ErrorMessage.NOT_FOUND, 404);
      return;
    }
    if (req.file) {
      fs.rmSync(`${category.imageUrl}`);
    }

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

    const {
      data: { name, description },
    } = parsed;

    const imagePath = `uploads/${req.file?.filename}`;

    const payload = req.file
      ? { name, description, imageUrl: imagePath }
      : { name, description };

    const updatedCategory = await categoryModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    apiResponse.success(
      res,
      "Category updated successfully",
      updatedCategory,
      200,
    );
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, 500);
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel.find();
    apiResponse.success(
      res,
      "Categories fetched successfully",
      categories,
      200,
    );
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, 500);
  }
};

export const getByCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await getCategoryByIdService(id as string);
    apiResponse.success(res, "Category fetched successfully", category, 200);
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, 500);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteCategoryService(id as string);

    apiResponse.success(res, "Category deleted successfully", null, 200);
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, 500);
  }
};
