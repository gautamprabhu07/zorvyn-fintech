const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/User');
const FinancialRecord = require('../src/models/FinancialRecord');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.test'), override: true });

jest.setTimeout(30000);

const buildTestMongoUri = (uri) => {
  if (!uri) {
    return '';
  }

  if (uri.includes('/?')) {
    return uri.replace('/?', '/zorvyn_fintech_test?');
  }

  if (/\/[^/?]+\?/.test(uri)) {
    return uri.replace(/\/[^/?]+\?/, '/zorvyn_fintech_test?');
  }

  if (/\/[^/?]+$/.test(uri)) {
    return uri.replace(/\/[^/?]+$/, '/zorvyn_fintech_test');
  }

  return `${uri.replace(/\/$/, '')}/zorvyn_fintech_test`;
};

const testMongoUri = process.env.MONGO_URI_TEST || buildTestMongoUri(process.env.MONGO_URI);

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';

  if (!testMongoUri) {
    throw new Error('Test database URI is not configured. Set MONGO_URI or MONGO_URI_TEST.');
  }

  process.env.MONGO_URI = testMongoUri;

  await mongoose.connect(testMongoUri);
});

afterEach(async () => {
  await Promise.all([User.deleteMany({}), FinancialRecord.deleteMany({})]);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth and Records API', () => {
  test('POST /auth/register creates a user without returning password', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Test User',
      email: 'register-test@example.com',
      password: 'secret123',
      role: 'ANALYST',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.email).toBe('register-test@example.com');
    expect(response.body.data.password).toBeUndefined();
  });

  test('POST /auth/login returns JWT token for previously registered user', async () => {
    await request(app).post('/auth/register').send({
      name: 'Login User',
      email: 'login-test@example.com',
      password: 'secret123',
      role: 'ANALYST',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'login-test@example.com',
      password: 'secret123',
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token.length).toBeGreaterThan(0);
  });

  test('POST /records creates a financial record for admin user with token', async () => {
    await request(app).post('/auth/register').send({
      name: 'Admin User',
      email: 'admin-record-test@example.com',
      password: 'secret123',
      role: 'ADMIN',
    });

    const loginResponse = await request(app).post('/auth/login').send({
      email: 'admin-record-test@example.com',
      password: 'secret123',
    });

    const token = loginResponse.body.token;

    const createResponse = await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 2500,
        type: 'INCOME',
        category: 'Salary',
        date: '2025-01-10',
        note: 'January payroll',
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data).toBeDefined();
    expect(createResponse.body.data.amount).toBe(2500);
    expect(createResponse.body.data.type).toBe('INCOME');
  });
});
