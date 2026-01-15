import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { charge, stripeWebhook } from './controllers/payment.controller';
import { errorHandler } from './middleware/error.middleware';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ verify: (req: any, res, buf) => { req.rawBody = buf; } }));
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
import { authenticate } from './middleware/auth.middleware';

// Charges must be made by authenticated customers
app.post('/api/payment/charge', authenticate as any, charge);
app.post('/api/payment/webhook', stripeWebhook);

app.use(errorHandler);

export default app;