import { AppError, ErrorMessage } from "../helpers/error";
import categoryModel, { ICategory } from "../models/category.model";
import fs from "fs";

export const createCategoryService = async (
  name: string,
  description?: string,
  image?: string,
) => {
  const newCategory = new categoryModel({
    name,
    description,
    imageUrl: image,
  });

  await newCategory.save();

  return newCategory;
};

export const updateCategoryService = async (
  id: string,
  payload: Partial<ICategory>,
) => {
  return await categoryModel.findByIdAndUpdate(id, payload);
};

export const getAllCategoriesService = async () => {
  return await categoryModel.find();
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
