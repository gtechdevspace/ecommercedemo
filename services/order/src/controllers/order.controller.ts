import { Request, Response, NextFunction } from 'express';
import { createPool } from '../db/pg';
import { publishOrderCreated } from '../producer/snsClient';

const pool = createPool();

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const client = await pool.connect();
  try {
    const { user_id, items, total } = req.body;
    await client.query('BEGIN');
    const insertText = 'INSERT INTO orders(user_id, items, total, status) VALUES($1, $2, $3, $4) RETURNING id, created_at';
    const result = await client.query(insertText, [user_id, JSON.stringify(items), total, 'created']);
    const order = { id: result.rows[0].id, user_id, items, total, status: 'created', created_at: result.rows[0].created_at };

    // Publish event to SNS for downstream consumers (inventory, payment, notification)
    await publishOrderCreated(process.env.ORDER_TOPIC_ARN || 'arn:aws:sns:us-east-1:000000000000:order-topic', { event: 'ORDER_CREATED', data: order });

    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

export const health = (req: Request, res: Response) => {
  res.json({ status: 'ok' });
};
