import { Router } from 'express';
import { stockController } from '../controllers/stock';


const router = Router();



router.post('/', stockController);



export default router;