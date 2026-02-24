const request = require('supertest');

// Ensure a JWT secret is set for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Mock the pg pool so tests run without a real Postgres instance
jest.mock('../config/db', () => {
  const bcrypt = require('bcryptjs');
  const hashed = bcrypt.hashSync('P@ssw0rd!', 10);
  const mock = {
    query: jest.fn((text, params) => {
      if (text.includes('SELECT id, email, password, role FROM users')) {
        return Promise.resolve({ rows: [{ id: 1, email: params[0], password: hashed, role: 'user' }] });
      }
      // for INSERTs and other queries, resolve with empty result
      return Promise.resolve({ rows: [] });
    }),
    end: jest.fn(() => Promise.resolve()),
  };
  return mock;
});

const app = require('../server');

describe('Auth flow', () => {
  const email = `test+${Date.now()}@example.com`;
  const password = 'P@ssw0rd!';
  let token;

  test('register should create user', async () => {
    const res = await request(app).post('/api/auth/register').send({ email, password });
    expect([201, 409]).toContain(res.statusCode);
  });

  test('login should return token', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('profile should return user when authorized', async () => {
    const res = await request(app).get('/api/profile').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', email);
  });
});
