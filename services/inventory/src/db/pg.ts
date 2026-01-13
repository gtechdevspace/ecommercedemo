import { Pool } from 'pg';

export const createPool = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ecommerce'
  });
  return pool;
};
