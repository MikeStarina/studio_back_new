import { Router } from "express";
import { dealAddHook } from "../controllers/deal-add-hook";

const router = Router();

router.post("/", dealAddHook);

export default router;
