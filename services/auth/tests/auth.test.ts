import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  process.env.MONGO_URI = uri;
  await connectDB(uri);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

describe('Auth API', () => {
  it('signs up and logs in (DB)', async () => {
    const email = `test${Date.now()}@example.com`;
    await request(app).post('/api/auth/signup').send({ email, password: 'Passw0rd!' }).expect(201);
    const login = await request(app).post('/api/auth/login').send({ email, password: 'Passw0rd!' }).expect(200);
    expect(login.body.access).toBeDefined();
    expect(login.body.refresh).toBeDefined();
  });

  it('rotates refresh token on refresh and invalidates old token', async () => {
    const email = `test${Date.now()}@example.com`;
    await request(app).post('/api/auth/signup').send({ email, password: 'Passw0rd!' }).expect(201);
    const login = await request(app).post('/api/auth/login').send({ email, password: 'Passw0rd!' }).expect(200);
    const oldRefresh = login.body.refresh;

    const refreshed = await request(app).post('/api/auth/refresh').send({ token: oldRefresh }).expect(200);
    expect(refreshed.body.access).toBeDefined();
    expect(refreshed.body.refresh).toBeDefined();

    // old token should now be invalid
    await request(app).post('/api/auth/refresh').send({ token: oldRefresh }).expect(401);
  });

  it('logout revokes the refresh token', async () => {
    const email = `test${Date.now()}@example.com`;
    await request(app).post('/api/auth/signup').send({ email, password: 'Passw0rd!' }).expect(201);
    const login = await request(app).post('/api/auth/login').send({ email, password: 'Passw0rd!' }).expect(200);
    const refresh = login.body.refresh;

    const out = await request(app).post('/api/auth/logout').send({ token: refresh }).expect(200);
    expect(out.body.revoked).toBe(true);

    // cannot refresh with revoked token
    await request(app).post('/api/auth/refresh').send({ token: refresh }).expect(401);
  });
});
