import { Router } from 'express';
import { createOrder, health } from '../controllers/order.controller';
import { authenticate, AuthRequest } from './../middleware/auth.middleware';

const router = Router();

router.get('/health', health);
// Only authenticated customers may create orders
router.post('/', authenticate as any, createOrder);

export default router;
