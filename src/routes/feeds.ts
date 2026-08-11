import { Router } from "express";
import { getProductsYmlFeed } from "../controllers/feeds";

const router = Router();

router.get("/products.yml", getProductsYmlFeed);

export default router;
