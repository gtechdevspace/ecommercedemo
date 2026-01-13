import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100
  })
);

app.use('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;
