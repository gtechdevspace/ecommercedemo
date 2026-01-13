import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import cartRoutes from './routes/cart.routes';
import logger from './utils/logger';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

app.use('/api/cart', cartRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// basic error handler
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;