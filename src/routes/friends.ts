import { Router } from 'express';
import { getFriends, getFriend } from '../controllers/friends';



const router = Router();




router.get('/', getFriends);
router.post('/friend', getFriend);






export default router;