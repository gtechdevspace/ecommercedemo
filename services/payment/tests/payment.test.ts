import { createPool } from '../src/db/pg';
import fs from 'fs';
import path from 'path';
import * as paymentService from '../src/services/payment.service';
import Stripe from 'stripe';

const sqlPath = path.resolve(__dirname, '../sql/init.sql');
let pool: any;

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      paymentIntents: {
        create: jest.fn().mockResolvedValue({ id: 'pi_test_1', status: 'succeeded' })
      }
    };
  });
});

beforeAll(async () => {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ecom_test';
  pool = createPool();
  const schema = fs.readFileSync(sqlPath, 'utf-8');
  await pool.query(schema);
});

afterAll(async () => {
  await pool.query('DROP TABLE IF EXISTS payments;');
  await pool.end();
});

describe('Payment processing', () => {
  it('processes a payment and is idempotent', async () => {
    const result1 = await paymentService.processPayment(pool, 9001, 10.5, 'pm_card_visa', 'idem-1');
    expect(result1.stripe_payment_id).toBe('pi_test_1');
    expect(result1.idempotent).toBe(false);

    const result2 = await paymentService.processPayment(pool, 9001, 10.5, 'pm_card_visa', 'idem-1');
    expect(result2.idempotent).toBe(true);
  });
});