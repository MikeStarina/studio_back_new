import { Router } from "express";
import {
  getBanners,
  getAdminBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
} from "../controllers/banners";
import { authMiddleware, requireRole } from "../middlewares/auth";

const router = Router();

const adminOnly = [authMiddleware, requireRole("admin")];

router.get("/", getBanners);
router.get("/admin", ...adminOnly, getAdminBanners);
router.post("/upload", ...adminOnly, uploadBannerImage);
router.post("/", ...adminOnly, createBanner);
router.get("/:id", ...adminOnly, getBannerById);
router.patch("/:id", ...adminOnly, updateBanner);
router.delete("/:id", ...adminOnly, deleteBanner);

export default router;
