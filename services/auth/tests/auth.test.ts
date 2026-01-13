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

describe('Auth API', () => {
  it('signs up and logs in (DB)', async () => {
    const email = `test${Date.now()}@example.com`;
    await request(app).post('/api/auth/signup').send({ email, password: 'Passw0rd!' }).expect(201);
    const login = await request(app).post('/api/auth/login').send({ email, password: 'Passw0rd!' }).expect(200);
    expect(login.body.access).toBeDefined();
    expect(login.body.refresh).toBeDefined();
  });
});
