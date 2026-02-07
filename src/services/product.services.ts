import { AppError } from "../helpers/error";
import productModel from "../models/product.model";
import fs from "fs";
import { ProductType } from "../types";
import { getPaginate, getSearch, getSort } from "../helpers/pagination";

export const createProductService = async (payload: ProductType) => {
  return (await productModel.create(payload)).populate("category");
};

export const getAllProductsService = async (query: any) => {
  const { page, limit, skip } = getPaginate(query);
  const sort = getSort(query, ["name", "price", "createdAt"]);
  const search = getSearch(query, ["name", "description"]);

  const [items, total] = await Promise.all([
    productModel
      .find(search)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("category"),
    productModel.countDocuments(search),
  ]);

  return { items, total, page, limit };
};

export const getProductByIdService = async (id: string) => {
  const product = await productModel.findById(id).populate("category");

  if (!product) throw new AppError("Product not found", 404);

  return product;
};

export const updateProductService = async (
  id: string,
  payload: Partial<ProductType>,
) => {
  const product = await productModel.findById(id);

  if (!product) throw new AppError("Product not found", 404);

  if (payload.imageUrl) {
    fs.rmSync(product.imageUrl);
  }

  return await productModel
    .findByIdAndUpdate(id, payload, {
      new: true,
    })
    .populate("category");
};

export const deleteProductService = async (id: string) => {
  const product = await productModel.findById(id);

  if (!product) throw new AppError("Product not found", 404);
  fs.rmSync(product.imageUrl);
  return await productModel.findByIdAndDelete(id);
};
