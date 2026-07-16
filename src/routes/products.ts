import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products";
import { authMiddleware, requireRole } from "../middlewares/auth";

const router = Router();

const adminOnly = [authMiddleware, requireRole("admin")];

router.get("/", getProducts);
router.post("/", ...adminOnly, createProduct);
router.get("/:id", ...adminOnly, getProductById);
router.patch("/:id", ...adminOnly, updateProduct);
router.delete("/:id", ...adminOnly, deleteProduct);

export default router;
