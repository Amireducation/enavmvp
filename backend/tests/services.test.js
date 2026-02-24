const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../server');

const fallbackPath = path.join(__dirname, '..', 'data', 'serviceRequests.memory.json');

beforeAll(() => {
  // ensure fallback is empty before tests
  try { fs.writeFileSync(fallbackPath, JSON.stringify([], null, 2), 'utf8'); } catch (e) { }
});

describe('Services API', () => {
  test('GET /api/services returns seed list', async () => {
    const res = await request(app).get('/api/services');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('services');
    expect(Array.isArray(res.body.services)).toBe(true);
    expect(res.body.services.length).toBeGreaterThan(0);
  });
});

describe('Service Requests API', () => {
  test('POST then GET /api/service-requests', async () => {
    const payload = { user_id: 'test_user', service_name: 'Test request' };
    const post = await request(app).post('/api/service-requests').send(payload).set('Accept', 'application/json');
    expect(post.statusCode).toBe(201);
    expect(post.body).toHaveProperty('request');
    expect(post.body.request).toHaveProperty('request_id');

    const get = await request(app).get('/api/service-requests');
    expect(get.statusCode).toBe(200);
    expect(get.body).toHaveProperty('requests');
    const found = get.body.requests.find(r => r.request_id === post.body.request.request_id);
    expect(found).toBeDefined();
  });
});
