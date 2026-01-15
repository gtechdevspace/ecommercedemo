import app from './app';
import logger from './utils/logger';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');

    // Security: ensure secrets are set in non-dev environments
    if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
      logger.warn('JWT_SECRET/REFRESH_SECRET not set — using defaults is insecure for production. Use Secrets Manager or env vars.');
    }

    app.listen(PORT, () => {
      logger.info(`Auth service listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
})();
