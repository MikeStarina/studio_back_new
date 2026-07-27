import { Router } from "express";
import fileUpload from "express-fileupload";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductPhoto,
  deleteProductPhoto,
} from "../controllers/products";
import { authMiddleware, requireRole } from "../middlewares/auth";

const router = Router();

const adminOnly = [authMiddleware, requireRole("admin")];

router.get("/", getProducts);
router.post("/", ...adminOnly, createProduct);
router.get("/:id", ...adminOnly, getProductById);
router.patch("/:id", ...adminOnly, updateProduct);
router.delete("/:id", ...adminOnly, deleteProduct);
// This router is mounted before the global fileUpload middleware in app.ts.
router.post("/:id/photos", ...adminOnly, fileUpload(), uploadProductPhoto);
router.delete("/:id/photos", ...adminOnly, deleteProductPhoto);

export default router;
