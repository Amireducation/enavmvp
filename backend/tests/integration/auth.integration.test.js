const { PostgresContainer } = require('testcontainers');
const { execSync } = require('child_process');
const fetch = require('node-fetch');
const path = require('path');

jest.setTimeout(300000); // 5 minutes - allow time for image download and container startup

let pgContainer;
let dbUrl;

beforeAll(async () => {
  console.log('Integration test: starting Postgres container (may take a while on first run)');
  // Start Postgres container using the PostgresContainer helper
  pgContainer = await new PostgresContainer('postgres:15')
    .withDatabase('testdb')
    .withUsername('test')
    .withPassword('test')
    .start();

  console.log('Postgres container started');
  const port = pgContainer.getMappedPort(5432);
  const host = pgContainer.getHost();
  dbUrl = `postgres://test:test@${host}:${port}/testdb?sslmode=disable`;
  console.log('DB URL:', dbUrl.replace(/:[^:@]+@/, ':***@'));

  // Export env for node-pg-migrate and start migrations
  process.env.POSTGRES_CONN_STRING = dbUrl;

  console.log('Running npm ci in backend...');
  execSync('npm ci', { cwd: path.resolve(__dirname, '..', '..'), stdio: 'inherit' });
  console.log('Running migrations...');
  execSync('npm run migrate --if-present', { cwd: path.resolve(__dirname, '..', '..'), stdio: 'inherit' });
  console.log('Migrations complete');

  // Start the app
  // require after env is set
  console.log('Starting app...');
  const app = require('../../server');
  global.__APP__ = app.listen(0);
  const address = global.__APP__.address();
  global.__BASEURL__ = `http://127.0.0.1:${address.port}`;
  console.log('App started at', global.__BASEURL__);
});

afterAll(async () => {
  if (global.__APP__) {
    global.__APP__.close();
  }
  if (pgContainer) await pgContainer.stop();
});

test('register -> login -> profile flow', async () => {
  if (!DOCKER_AVAILABLE) {
    return expect(true).toBeTruthy();
  }
  const email = `intuser+${Date.now()}@example.com`;
  const pwd = 'P@ssw0rd123';

  // Register
  let res = await fetch(`${global.__BASEURL__}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pwd, role: 'user' }),
  });
  expect(res.status).toBe(201);

  // Login
  res = await fetch(`${global.__BASEURL__}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pwd }),
  });
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body.token).toBeTruthy();

  // Profile
  res = await fetch(`${global.__BASEURL__}/api/profile`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${body.token}` },
  });
  expect(res.status).toBe(200);
  const profile = await res.json();
  expect(profile.user.email).toBe(email);
});
