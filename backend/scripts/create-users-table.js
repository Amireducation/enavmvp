const pool = require('../config/db');

async function createUsersTable() {
  if (!process.env.POSTGRES_CONN_STRING) {
    console.log('POSTGRES_CONN_STRING not set — skipping users table creation');
    return;
  }

  const createUsers = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  `;

  try {
    await pool.query(createUsers);
    console.log('users table ready');
  } catch (err) {
    console.error('Error creating users table:', err.message);
    process.exitCode = 2;
  } finally {
    try { await pool.end(); } catch (e) {}
  }
}

createUsersTable();
