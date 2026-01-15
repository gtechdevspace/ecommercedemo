"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../src/config/db");
beforeAll(async () => {
    await (0, db_1.connectDB)(process.env.MONGO_URI || 'mongodb://localhost:27017/ecom_test');
});
afterAll(async () => {
    await mongoose_1.default.connection.db.dropDatabase();
    await mongoose_1.default.disconnect();
});
describe('Auth API', () => {
    it('signs up and logs in (DB)', async () => {
        const email = `test${Date.now()}@example.com`;
        await (0, supertest_1.default)(app_1.default).post('/api/auth/signup').send({ email, password: 'Passw0rd!' }).expect(201);
        const login = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ email, password: 'Passw0rd!' }).expect(200);
        expect(login.body.access).toBeDefined();
        expect(login.body.refresh).toBeDefined();
    });
    it('rotates refresh token on refresh and invalidates old token', async () => {
        const email = `test${Date.now()}@example.com`;
        await (0, supertest_1.default)(app_1.default).post('/api/auth/signup').send({ email, password: 'Passw0rd!' }).expect(201);
        const login = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ email, password: 'Passw0rd!' }).expect(200);
        const oldRefresh = login.body.refresh;
        const refreshed = await (0, supertest_1.default)(app_1.default).post('/api/auth/refresh').send({ token: oldRefresh }).expect(200);
        expect(refreshed.body.access).toBeDefined();
        expect(refreshed.body.refresh).toBeDefined();
        // old token should now be invalid
        await (0, supertest_1.default)(app_1.default).post('/api/auth/refresh').send({ token: oldRefresh }).expect(401);
    });
    it('logout revokes the refresh token', async () => {
        const email = `test${Date.now()}@example.com`;
        await (0, supertest_1.default)(app_1.default).post('/api/auth/signup').send({ email, password: 'Passw0rd!' }).expect(201);
        const login = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ email, password: 'Passw0rd!' }).expect(200);
        const refresh = login.body.refresh;
        const out = await (0, supertest_1.default)(app_1.default).post('/api/auth/logout').send({ token: refresh }).expect(200);
        expect(out.body.revoked).toBe(true);
        // cannot refresh with revoked token
        await (0, supertest_1.default)(app_1.default).post('/api/auth/refresh').send({ token: refresh }).expect(401);
    });
});
