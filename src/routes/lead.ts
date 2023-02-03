import { Router } from "express";
import { createLead } from "../controllers/lead";




const router = Router();



router.post('/', createLead);



export default router;