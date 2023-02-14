import { Router } from "express";
import { promocodesController } from "../controllers/promocodes";




const router = Router();




router.post('/', promocodesController);




export default router;