const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function seed() {
  const file = path.join(__dirname, '..', 'data', 'services.seed.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));

  const createTable = `
  CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    service_id TEXT UNIQUE NOT NULL,
    category TEXT,
    name TEXT,
    description TEXT,
    responsible_agency TEXT,
    estimated_processing_time TEXT,
    service_fee NUMERIC,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
  );
  `;

  try {
    await pool.query(createTable);

    for (const s of data) {
      const q = `INSERT INTO services (service_id, category, name, description, responsible_agency, estimated_processing_time, service_fee, is_archived, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (service_id) DO UPDATE SET
          category = EXCLUDED.category,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          responsible_agency = EXCLUDED.responsible_agency,
          estimated_processing_time = EXCLUDED.estimated_processing_time,
          service_fee = EXCLUDED.service_fee,
          is_archived = EXCLUDED.is_archived,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at;`;

      const vals = [s.service_id, s.category, s.name, s.description, s.responsible_agency, s.estimated_processing_time, s.service_fee, s.is_archived, s.created_at, s.updated_at];
      await pool.query(q, vals);
    }

    console.log('Services seeded successfully');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 2;
  } finally {
    try { await pool.end(); } catch (e) {}
  }
}

seed();
