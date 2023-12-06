import { Router } from "express";
import { aiChat } from "../controllers/aiChat"

const router = Router();

router.post('/', aiChat)

export default router;
