import { Router } from "express";
import { cdekAuth } from "../controllers/cdekAuth";




const router = Router();




router.get('/auth', cdekAuth);