import { AppError, ErrorMessage } from "../helpers/error";
import categoryModel, { ICategory } from "../models/category.model";
import fs from "fs";
import { CategoryType } from "../types";
import { getPaginate, getSearch, getSort } from "../helpers/pagination";

export const createCategoryService = async (payload: CategoryType) => {
  return await categoryModel.create(payload);
};

export const updateCategoryService = async (
  id: string,
  payload: Partial<CategoryType>,
) => {
  const category = await categoryModel.findById(id);
  if (!category) throw new AppError(ErrorMessage.NOT_FOUND, 404);

  if (payload.imageUrl) {
    fs.rmSync(payload.imageUrl);
  }

  return await categoryModel.findByIdAndUpdate(id, payload, { new: true });
};

export const getAllCategoriesService = async (query: any) => {
  const { page, limit, skip } = getPaginate(query);

  const sort = getSort(query, ["name", "createdAt"]);

  const search = getSearch(query, ["name", "description"]);

  const [items, total] = await Promise.all([
    categoryModel.find(search).sort(sort).skip(skip).limit(limit),
    categoryModel.countDocuments(search),
  ]);

  return { items, total, page, limit };
};

export const getCategoryByIdService = async (id: string) => {
  const category = await categoryModel.findById(id);
  if (!category) throw new AppError(ErrorMessage.NOT_FOUND, 404);
  return category;
};

export const deleteCategoryService = async (id: string) => {
  const category = await categoryModel.findById(id);
  if (!category) throw new AppError(ErrorMessage.NOT_FOUND, 404);
  fs.rmSync(category.imageUrl!);
  await categoryModel.findByIdAndDelete(id);
  return true;
};
