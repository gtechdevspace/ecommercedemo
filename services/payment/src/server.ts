import app from './app';
import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 4300;

(async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Payment service listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start Payment service', err);
    process.exit(1);
  }
})();