import Stripe from 'stripe';
import { Pool } from 'pg';
import logger from '../utils/logger';
import { publishPaymentEvent } from '../producer/snsClient';

const stripe = new Stripe(process.env.STRIPE_SECRET || 'sk_test_xxx', { apiVersion: '2023-08-16' });

async function retry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 200) {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
    }
  }
  throw lastErr;
}

export async function processPayment(pool: Pool, orderId: number, amount: number, payment_method: string, idempotencyKey?: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Idempotency: check existing payment by idempotency_key
    if (idempotencyKey) {
      const ex = await client.query('SELECT id, status, stripe_payment_id FROM payments WHERE idempotency_key = $1', [idempotencyKey]);
      if (ex.rows.length > 0) {
        await client.query('COMMIT');
        return { id: ex.rows[0].id, status: ex.rows[0].status, stripe_payment_id: ex.rows[0].stripe_payment_id, idempotent: true };
      }
    }

    // Create Stripe PaymentIntent with retry and idempotency
    const createIntent = async () => {
      if (process.env.STRIPE_MOCK === 'true') {
        // return a mocked PaymentIntent-like object for local testing
        return { id: `pi_mock_${Date.now()}`, status: 'succeeded', amount: Math.round(amount * 100), currency: 'usd', metadata: { order_id: orderId } } as any;
      }
      return await stripe.paymentIntents.create({ amount: Math.round(amount * 100), currency: 'usd', payment_method, metadata: { order_id: String(orderId) } }, { idempotencyKey });
    };
    const pi = await retry(createIntent, 3, 300);

    // Persist payment record
    const insertText = 'INSERT INTO payments(order_id, stripe_payment_id, amount, currency, status, idempotency_key) VALUES($1,$2,$3,$4,$5,$6) RETURNING id, status';
    const result = await client.query(insertText, [orderId, pi.id, amount, 'usd', pi.status, idempotencyKey]);
    const payment = { id: result.rows[0].id, order_id: orderId, stripe_payment_id: pi.id, amount, status: result.rows[0].status };

    // Publish payment event
    if (process.env.PAYMENT_TOPIC_ARN) {
      await retry(() => publishPaymentEvent(process.env.PAYMENT_TOPIC_ARN as string, { event: 'PAYMENT_' + (payment.status || 'unknown').toUpperCase(), data: payment }), 3, 200);
    }

    await client.query('COMMIT');
    return { ...payment, idempotent: false };
  } catch (err: any) {
    await client.query('ROLLBACK');
    logger.error('Payment processing failed', err);
    // Publish a PAYMENT_FAILED event for downstream compensation
    try {
      if (process.env.PAYMENT_TOPIC_ARN) {
        await publishPaymentEvent(process.env.PAYMENT_TOPIC_ARN as string, { event: 'PAYMENT_FAILED', data: { order_id: orderId, reason: err.message } });
      }
    } catch (pubErr) {
      logger.error('Failed to publish PAYMENT_FAILED event', pubErr);
    }
    throw err;
  } finally {
    client.release();
  }
}
