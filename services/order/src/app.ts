import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

app.use('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/orders', orderRoutes);
app.use(errorHandler);

export default app;
