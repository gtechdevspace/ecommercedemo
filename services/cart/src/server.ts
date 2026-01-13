import dotenv from 'dotenv';
dotenv.config();
import logger from './utils/logger';
import { connectDB } from './config/db';
import app from './app';

const port = process.env.PORT || 4300;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/ecom');
    app.listen(port, () => {
      logger.info(`Cart service running on port ${port}`);
    });
  } catch (err) {
    logger.error('Failed to start cart service', err);
    process.exit(1);
  }
})();