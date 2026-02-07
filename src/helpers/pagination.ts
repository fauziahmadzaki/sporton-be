import { SortOrder } from "mongoose";

export const getPaginate = (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const getSort = (
  query: any,
  allowedFields: string[],
): Record<string, SortOrder> => {
  const { sortBy, order } = query;

  if (!allowedFields.includes(sortBy)) {
    return { createdAt: -1 };
  }

  return {
    [sortBy]: order === "asc" ? 1 : -1,
  };
};

export const getSearch = (query: any, fields: string[]) => {
  if (!query.search) return {};

  return {
    $or: fields.map((field) => ({
      [field]: { $regex: query.search, $options: "i" },
    })),
  };
};
