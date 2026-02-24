#!/usr/bin/env node

/**
 * Ethiopian Navigator - Neon Database Setup Script
 * This script initializes the Neon PostgreSQL database with the complete schema
 */

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  const {
    NEON_DATABASE_HOST = 'localhost',
    NEON_DATABASE_PORT = '5432',
    NEON_DATABASE_NAME = 'ethiopian_navigator',
    NEON_DATABASE_USER = 'postgres',
    NEON_DATABASE_PASSWORD = '',
  } = process.env;

  return `postgresql://${NEON_DATABASE_USER}:${NEON_DATABASE_PASSWORD}@${NEON_DATABASE_HOST}:${NEON_DATABASE_PORT}/${NEON_DATABASE_NAME}`;
};

const setupDatabase = async () => {
  const databaseUrl = getDatabaseUrl();
  const client = new Client({ connectionString: databaseUrl });

  try {
    console.log('[v0] Connecting to Neon database...');
    await client.connect();
    console.log('[v0] Successfully connected to database');

    // Read and execute the initialization SQL script
    const sqlPath = path.join(process.cwd(), 'scripts', 'init-database.sql');
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`SQL initialization file not found at ${sqlPath}`);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`[v0] Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    let successCount = 0;
    for (const statement of statements) {
      try {
        await client.query(statement);
        successCount++;
      } catch (error) {
        if (error.code === '42P07' || error.message.includes('already exists')) {
          // Table/index already exists - that's fine
          console.log(`[v0] Skipping (already exists): ${statement.substring(0, 50)}...`);
        } else {
          console.error(`[v0] Error executing statement:`, error.message);
          console.error(`[v0] Statement: ${statement.substring(0, 100)}...`);
        }
      }
    }

    console.log(`[v0] Successfully executed ${successCount}/${statements.length} statements`);

    // Verify schema was created
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log(`[v0] Database now has ${result.rows.length} tables:`);
    result.rows.forEach(row => {
      console.log(`[v0]   - ${row.table_name}`);
    });

    console.log('[v0] Database setup completed successfully!');

  } catch (error) {
    console.error('[v0] Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
};

// Run the setup
setupDatabase();
