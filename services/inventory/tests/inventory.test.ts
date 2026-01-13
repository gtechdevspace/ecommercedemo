import { createPool } from '../src/db/pg';
import fs from 'fs';
import path from 'path';
import { reserveItems } from '../src/services/inventory.service';

const sqlPath = path.resolve(__dirname, '../sql/init.sql');

let pool: any;

beforeAll(async () => {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ecom_test';
  pool = createPool();
  const schema = fs.readFileSync(sqlPath, 'utf-8');
  await pool.query(schema);
});

afterAll(async () => {
  await pool.query('DROP TABLE IF EXISTS reservations;');
  await pool.query('DROP TABLE IF EXISTS inventory;');
  await pool.end();
});

describe('Inventory reservation', () => {
  it('reserves items when stock is sufficient', async () => {
    await pool.query('INSERT INTO inventory(product_id, stock) VALUES($1, $2) ON CONFLICT DO NOTHING', [1001, 10]);
    const res = await reserveItems(pool, 2001, [{ product_id: 1001, qty: 2 }]);
    expect(res.status).toBe('reserved');
    const inv = await pool.query('SELECT stock, reserved FROM inventory WHERE product_id = $1', [1001]);
    expect(inv.rows[0].stock).toBe(8);
    expect(inv.rows[0].reserved).toBe(2);
  });

  it('fails when stock is insufficient', async () => {
    await pool.query('INSERT INTO inventory(product_id, stock) VALUES($1, $2) ON CONFLICT DO NOTHING', [1002, 1]);
    await expect(reserveItems(pool, 2002, [{ product_id: 1002, qty: 2 }])).rejects.toThrow();
  });

  it('is idempotent for same order', async () => {
    await pool.query('INSERT INTO inventory(product_id, stock) VALUES($1, $2) ON CONFLICT DO NOTHING', [1003, 5]);
    const r1 = await reserveItems(pool, 3001, [{ product_id: 1003, qty: 2 }]);
    expect(r1.status).toBe('reserved');
    const r2 = await reserveItems(pool, 3001, [{ product_id: 1003, qty: 2 }]);
    expect(r2.status).toBe('already_reserved');
    const inv = await pool.query('SELECT stock, reserved FROM inventory WHERE product_id = $1', [1003]);
    expect(inv.rows[0].stock).toBe(3);
    expect(inv.rows[0].reserved).toBe(2);
  });
});