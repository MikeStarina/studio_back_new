import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories";
import { authMiddleware, requireRole } from "../middlewares/auth";

const router = Router();

const adminOnly = [authMiddleware, requireRole("admin")];

router.get("/", getCategories);
router.post("/", ...adminOnly, createCategory);
router.get("/:id", ...adminOnly, getCategoryById);
router.patch("/:id", ...adminOnly, updateCategory);
router.delete("/:id", ...adminOnly, deleteCategory);

export default router;
