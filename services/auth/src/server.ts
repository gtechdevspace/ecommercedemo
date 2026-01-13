import app from './app';
import logger from './utils/logger';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    app.listen(PORT, () => {
      logger.info(`Auth service listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
})();
