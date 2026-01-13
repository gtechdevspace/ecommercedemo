import dotenv from 'dotenv';
import app from './app';
import logger from './utils/logger';
import { connectDB } from './config/db';

dotenv.config();

(async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/ecom');
    const PORT = process.env.PORT || 4400;
    app.listen(PORT, () => {
      logger.info(`Product service listening on ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start Product service', err);
    process.exit(1);
  }
})();