import { Router } from "express";
import { cdekAuth } from "../controllers/cdekAuth";
import { cdekCities } from "../controllers/cdekCities";




const router = Router();




router.get('/auth', cdekAuth);
router.get('/cities', cdekCities);




export default router;