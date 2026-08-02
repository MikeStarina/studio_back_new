import { Router } from "express";
import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tags";
import { authMiddleware, requireRole } from "../middlewares/auth";

const router = Router();

const adminOnly = [authMiddleware, requireRole("admin")];

router.get("/", getTags);
router.post("/", ...adminOnly, createTag);
router.get("/:id", ...adminOnly, getTagById);
router.patch("/:id", ...adminOnly, updateTag);
router.delete("/:id", ...adminOnly, deleteTag);

export default router;
