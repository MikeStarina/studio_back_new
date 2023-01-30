import { Router } from 'express';
import { createOrder } from '../controllers/orders';


const router = Router();



router.post('/', createOrder);
router.patch('/:id');



export default router;




