import app from './app';
import { createPool } from './db/pg';
import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();

const pool = createPool();

(async () => {
  try {
    // Verify DB connectivity
    await pool.query('SELECT 1');
    const PORT = process.env.PORT || 4200;
    app.listen(PORT, () => {
      logger.info(`Order service listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start Order service', err);
    process.exit(1);
  }
})();