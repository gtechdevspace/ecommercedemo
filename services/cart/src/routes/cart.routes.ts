import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getCart, addCartItem, updateCartItem, removeCartItem, clearCart } from '../controllers/cart.controller';

const router = Router();

router.get('/', authenticate, getCart);
router.post('/items', authenticate, addCartItem);
router.patch('/items/:productId', authenticate, updateCartItem);
router.delete('/items/:productId', authenticate, removeCartItem);
router.post('/clear', authenticate, clearCart);

export default router;