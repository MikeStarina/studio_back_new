import { Router } from "express";
import { createLead } from "../controllers/lead";
import { validatorLead } from "../validator/validator";

const router = Router();

router.post("/", validatorLead, createLead);

export default router;
