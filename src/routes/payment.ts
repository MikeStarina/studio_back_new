import { Router } from "express";
import { getPaymentConfirmation } from "../controllers/payment";




const router = Router();


router.post('/', getPaymentConfirmation);



export default router;