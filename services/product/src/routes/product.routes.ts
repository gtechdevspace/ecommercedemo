import { Router } from 'express';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { validateProduct } from '../validators/product.validator';
import { authenticate } from '../middleware/auth.middleware';
import { permit } from '../middleware/rbac.middleware';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, permit('seller','admin'), validateProduct, createProduct);
router.put('/:id', authenticate, permit('seller','admin'), validateProduct, updateProduct);
router.delete('/:id', authenticate, permit('seller','admin'), deleteProduct);

export default router;