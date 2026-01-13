import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db';

beforeAll(async () => {
  await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/ecom_test');
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Cart API', () => {
  it('adds, updates and removes items', async () => {
    const token = process.env.TEST_AUTH_TOKEN || 'invalid-token';
    const add = await request(app).post('/api/cart/items').send({ productId: 'prod-1', quantity: 2 }).set('Authorization', 'Bearer ' + token).expect(200);
    expect(add.body.items.length).toBe(1);

    const get = await request(app).get('/api/cart').set('Authorization', 'Bearer ' + token).expect(200);
    expect(get.body.items[0].productId).toBe('prod-1');

    await request(app).patch('/api/cart/items/prod-1').send({ quantity: 5 }).set('Authorization', 'Bearer ' + token).expect(200);
    const updated = await request(app).get('/api/cart').set('Authorization', 'Bearer ' + token).expect(200);
    expect(updated.body.items[0].quantity).toBe(5);

    await request(app).delete('/api/cart/items/prod-1').set('Authorization', 'Bearer ' + token).expect(200);
    const removed = await request(app).get('/api/cart').set('Authorization', 'Bearer ' + token).expect(200);
    expect(removed.body.items.length).toBe(0);
  });
});