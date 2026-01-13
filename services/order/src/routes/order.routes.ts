import { Router } from 'express';
import { createOrder, health } from '../controllers/order.controller';

const router = Router();

router.get('/health', health);
router.post('/', createOrder);

export default router;
