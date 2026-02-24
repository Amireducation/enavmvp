const pool = require('../config/db');

async function createTables() {
  if (!process.env.POSTGRES_CONN_STRING) {
    console.log('POSTGRES_CONN_STRING not set — skipping DB table creation');
    return;
  }

  const createServiceRequests = `
  CREATE TABLE IF NOT EXISTS service_requests (
    id SERIAL PRIMARY KEY,
    request_id TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    service_description TEXT,
    category_suggestion TEXT,
    justification TEXT,
    status TEXT DEFAULT 'submitted',
    priority TEXT DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  `;

  try {
    await pool.query(createServiceRequests);
    console.log('service_requests table ready');
  } catch (err) {
    console.error('Error creating tables:', err.message);
    process.exitCode = 2;
  } finally {
    try { await pool.end(); } catch (e) {}
  }
}

createTables();
