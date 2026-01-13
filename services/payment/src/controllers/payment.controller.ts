import { Request, Response, NextFunction } from 'express';
import { createPool } from '../db/pg';
import { processPayment } from '../services/payment.service';
import Stripe from 'stripe';
import { publishPaymentEvent } from '../producer/snsClient';

const pool = createPool();
const stripe = new Stripe(process.env.STRIPE_SECRET || 'sk_test_xxx', { apiVersion: '2023-08-16' });

export const charge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, payment_method, order_id } = req.body;
    const idempotencyKey = req.headers['idempotency-key'] as string || req.body.idempotency_key;
    const result = await processPayment(pool, order_id, amount, payment_method, idempotencyKey);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  const sig = (req.headers['stripe-signature'] as string) || '';
  const raw = (req as any).rawBody;
  try {
    const event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test');
    if (event.type === 'payment_intent.succeeded') {
      const pi: any = event.data.object;
      const payload = { event: 'PAYMENT_SUCCEEDED', data: { stripe_id: pi.id, amount: (pi.amount / 100), currency: pi.currency } };
      if (process.env.PAYMENT_TOPIC_ARN) await publishPaymentEvent(process.env.PAYMENT_TOPIC_ARN, payload);
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi: any = event.data.object;
      const payload = { event: 'PAYMENT_FAILED', data: { stripe_id: pi.id } };
      if (process.env.PAYMENT_TOPIC_ARN) await publishPaymentEvent(process.env.PAYMENT_TOPIC_ARN, payload);
    }
    res.json({ received: true });
  } catch (err: any) {
    next(err);
  }
};
