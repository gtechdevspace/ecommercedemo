import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, signup, refreshToken, logout } from '../controllers/auth.controller';
import { validateSignup } from '../validators/auth.validator';

const router = Router();

const loginLimiter = rateLimit({ windowMs: 60 * 1000, max: 5 }); // max 5 login attempts/min

router.post('/signup', validateSignup, signup);
router.post('/login', loginLimiter, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

export default router;
