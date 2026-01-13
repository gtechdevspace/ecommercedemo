import dotenv from 'dotenv';
import { pollInventoryQueue } from './workers/sqsWorker';
import logger from './utils/logger';

dotenv.config();

(async () => {
  try {
    logger.info('Starting Inventory service worker');
    pollInventoryQueue();
  } catch (err) {
    logger.error('Failed to start Inventory worker', err);
    process.exit(1);
  }
})();
