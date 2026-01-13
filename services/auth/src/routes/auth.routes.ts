import { Router } from 'express';
import { login, signup, refreshToken } from '../controllers/auth.controller';
import { validateSignup } from '../validators/auth.validator';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', login);
router.post('/refresh', refreshToken);

export default router;
