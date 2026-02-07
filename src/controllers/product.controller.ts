import { Request, Response } from "express";
import { safeParse } from "zod";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator";
import { apiResponse } from "../helpers/response";
import { AppError, ErrorMessage } from "../helpers/error";
import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
} from "../services/product.services";
import { ProductType } from "../types";

export const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      apiResponse.error(res, ErrorMessage.INVALID_INPUT, null, 400);
      return;
    }

    const parsed = safeParse(createProductSchema, req.body);
    if (!parsed.success) {
      apiResponse.error(
        res,
        ErrorMessage.BAD_REQUEST,
        parsed.error.flatten().fieldErrors,
        400,
      );
      return;
    }

    const payload = {
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      category: parsed.data.category,
      stock: parsed.data.stock,
      imageUrl: `uploads/${req.file.filename}`,
    };

    const product = await createProductService(payload);

    apiResponse.created(res, product);
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parsed = safeParse(updateProductSchema, req.body);

    if (!parsed.success) {
      apiResponse.error(
        res,
        ErrorMessage.BAD_REQUEST,
        parsed.error.flatten().fieldErrors,
        400,
      );
      return;
    }

    const payload: Partial<ProductType> = {
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      category: parsed.data.category,
      stock: parsed.data.stock,
    };

    if (req.file) {
      payload.imageUrl = `uploads/${req.file.filename}`;
    }

    const updatedProduct = await updateProductService(id as string, payload);

    apiResponse.updated(res, updatedProduct);
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, null, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProductsService(req.query);

    apiResponse.success(res, products);
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, null, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id as string);

    apiResponse.success(res, product);
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, null, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteProductService(id as string);

    apiResponse.deleted(res);
  } catch (error) {
    if (error instanceof AppError) {
      apiResponse.error(res, error.message, null, error.statusCode);
      return;
    }
    apiResponse.error(res, ErrorMessage.INTERNAL_SERVER_ERROR, null, 500);
  }
};
