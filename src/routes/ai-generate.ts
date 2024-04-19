import { Router } from 'express';
import { generateImage } from '../controllers/ai-generate';


const router = Router();



router.post('/', generateImage);



export default router;