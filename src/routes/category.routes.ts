import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getByCategoryById,
  updateCategory,
} from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();
router.post("/", authenticate, upload.single("image"), createCategory);
router.get("/", getAllCategories);
router.get("/:id", getByCategoryById);
router.put("/:id", authenticate, upload.single("image"), updateCategory);
router.delete("/:id", authenticate, deleteCategory);

export default router;
