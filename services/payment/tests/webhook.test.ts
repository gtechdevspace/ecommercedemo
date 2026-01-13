import request from 'supertest';
import app from '../src/app';
import Stripe from 'stripe';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      webhooks: {
        constructEvent: jest.fn((raw: any, sig: any, secret: any) => {
          return { type: 'payment_intent.succeeded', data: { object: { id: 'pi_test', amount: 1000, currency: 'usd' } } };
        })
      }
    };
  });
});

describe('Payment webhook', () => {
  it('accepts a stripe webhook and publishes event', async () => {
    const res = await request(app).post('/api/payment/webhook').set('stripe-signature', 't=1,v1=abc').send({});
    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
  });
});