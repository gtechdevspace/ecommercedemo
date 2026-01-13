import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { charge, stripeWebhook } from './controllers/payment.controller';
import { errorHandler } from './middleware/error.middleware';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ verify: (req: any, res, buf) => { req.rawBody = buf; } }));
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.post('/api/payment/charge', charge);
app.post('/api/payment/webhook', stripeWebhook);

app.use(errorHandler);

export default app;