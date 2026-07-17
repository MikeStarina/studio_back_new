import { Router } from "express";
import {
  getBlogs,
  getAdminBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogCover,
} from "../controllers/blogs";
import { authMiddleware, requireRole } from "../middlewares/auth";

const router = Router();

const adminOnly = [authMiddleware, requireRole("admin")];

router.get("/", getBlogs);
router.get("/admin", ...adminOnly, getAdminBlogs);
router.post("/upload-cover", ...adminOnly, uploadBlogCover);
router.post("/", ...adminOnly, createBlog);
router.get("/:id", ...adminOnly, getBlogById);
router.patch("/:id", ...adminOnly, updateBlog);
router.delete("/:id", ...adminOnly, deleteBlog);

export default router;
