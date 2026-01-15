import app from './app';
import { createPool } from './db/pg';
import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();

const pool = createPool();
import fs from 'fs';
import path from 'path';
import { pollPaymentQueue } from './workers/sqsWorker';

(async () => {
  try {
    // Initialize DB schema if present
    const sqlPath = path.resolve(__dirname, './sql/init.sql');
    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, 'utf-8');
      await pool.query(sql);
      logger.info('Order DB schema applied');
    }

    // Verify DB connectivity
    await pool.query('SELECT 1');

    const PORT = process.env.PORT || 4200;
    app.listen(PORT, () => {
      logger.info(`Order service listening on port ${PORT}`);
    });

    // Start background workers if requested
    if (process.env.START_WORKERS === 'true') {
      pollPaymentQueue().catch((err) => logger.error('Payment worker failed', err));
    }
  } catch (err) {
    logger.error('Failed to start Order service', err);
    process.exit(1);
  }
})();