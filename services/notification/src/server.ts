import dotenv from 'dotenv';
import logger from './utils/logger';
import { pollPaymentQueue } from './workers/sqsWorker';

dotenv.config();

(async () => {
  try {
    logger.info('Starting Notification worker');
    pollPaymentQueue();
  } catch (err) {
    logger.error('Failed to start Notification worker', err);
    process.exit(1);
  }
})();