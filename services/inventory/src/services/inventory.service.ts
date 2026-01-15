import { Pool } from 'pg';
import logger from '../utils/logger';

export class InventoryError extends Error {}

export async function reserveItems(pool: Pool, orderId: number, items: Array<{ product_id: number; qty: number }>) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Idempotency: check if reservations already exist for this order
    const existing = await client.query('SELECT product_id FROM reservations WHERE order_id = $1', [orderId]);
    if (existing.rows.length > 0) {
      logger.info('Order already processed for inventory', { orderId });
      await client.query('COMMIT');
      return { status: 'already_reserved' };
    }

    // Attempt to reserve each item
    for (const it of items) {
      // Lock row to avoid races
      const sel = await client.query('SELECT stock FROM inventory WHERE product_id = $1 FOR UPDATE', [it.product_id]);
      if (sel.rows.length === 0) {
        throw new InventoryError(`Product ${it.product_id} not found`);
      }
      const stock = sel.rows[0].stock as number;
      if (stock < it.qty) {
        throw new InventoryError(`Insufficient stock for product ${it.product_id}`);
      }
      await client.query('UPDATE inventory SET stock = stock - $1, reserved = reserved + $1, updated_at = now() WHERE product_id = $2', [it.qty, it.product_id]);
      await client.query('INSERT INTO reservations(order_id, product_id, qty, status) VALUES($1, $2, $3, $4)', [orderId, it.product_id, it.qty, 'reserved']);
    }

    await client.query('COMMIT');
    return { status: 'reserved' };
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Failed to reserve items', err);
    if (err instanceof InventoryError) throw err;
    throw new InventoryError('Inventory reservation failed');
  } finally {
    client.release();
  }
}

export async function releaseReservations(pool: Pool, orderId: number) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Find reservations for this order that are currently reserved
    const resv = await client.query('SELECT product_id, qty FROM reservations WHERE order_id = $1 AND status = $2 FOR UPDATE', [orderId, 'reserved']);
    if (resv.rows.length === 0) {
      await client.query('COMMIT');
      logger.info('No reservations to release', { orderId });
      return { status: 'no_reservations' };
    }

    for (const r of resv.rows) {
      const { product_id, qty } = r;
      // Return stock and reduce reserved
      await client.query('UPDATE inventory SET stock = stock + $1, reserved = GREATEST(reserved - $1, 0), updated_at = now() WHERE product_id = $2', [qty, product_id]);
      await client.query('UPDATE reservations SET status = $1 WHERE order_id = $2 AND product_id = $3', ['released', orderId, product_id]);
    }

    await client.query('COMMIT');
    return { status: 'released' };
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Failed to release reservations', err);
    throw new InventoryError('Inventory release failed');
  } finally {
    client.release();
  }
}
