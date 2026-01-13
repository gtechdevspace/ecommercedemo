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

describe('Product API', () => {
  it('creates and retrieves a product', async () => {
    const p = { name: 'Test Product', price: 9.99 };
    const created = await request(app).post('/api/products').send(p).set('Authorization', 'Bearer invalid').expect(401);
    // Use direct model for creation to avoid needing auth in this test
    const res = await request(app).post('/api/products').send(p).set('Authorization', 'Bearer ' + process.env.TEST_AUTH_TOKEN).expect(201);
    const id = res.body._id;
    const get = await request(app).get(`/api/products/${id}`).expect(200);
    expect(get.body.name).toBe('Test Product');
  });
});