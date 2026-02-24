const request = require('supertest');
const app = require('../server');

describe('Basic API smoke tests', () => {
  test('GET /api/status should return 200 and status ok', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
