import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

import { audit } from './middleware/audit.middleware';

app.use('/health', (req, res) => res.json({ status: 'ok' }));
app.use(audit);
app.use('/api/orders', orderRoutes);
app.use(errorHandler);

export default app;
