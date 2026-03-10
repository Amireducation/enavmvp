#!/usr/bin/env node

// File: backend/scripts/run-phase1-migrations.ts
// Purpose: Execute all Phase 1 database migrations
// Ensures database schema is properly set up for microservices

import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { environmentConfig } from '../config/environment';
import { logger } from '../libs/logging/logger';

interface MigrationResult {
  name: string;
  success: boolean;
  error?: string;
  duration: number;
}

class MigrationRunner {
  private pool: Pool;
  private results: MigrationResult[] = [];

  constructor() {
    this.pool = new Pool({
      connectionString: environmentConfig.database.url,
      ssl: environmentConfig.database.ssl,
    });
  }

  async run(): Promise<void> {
    try {
      logger.info('Starting Phase 1 database migrations');

      await this.ensureMigrationsTable();
      const migrations = this.getMigrations();

      for (const migration of migrations) {
        await this.runMigration(migration);
      }

      this.printResults();

      if (this.results.some((r) => !r.success)) {
        process.exit(1);
      }

      logger.info('Phase 1 migrations completed successfully');
    } catch (error) {
      logger.error('Migration failed', error as Error);
      process.exit(1);
    } finally {
      await this.pool.end();
    }
  }

  private async ensureMigrationsTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await this.pool.query(query);
    logger.info('Migrations table ready');
  }

  private getMigrations(): string[] {
    const migrationsDir = path.join(__dirname, '../database/migrations');
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));
    return files.sort();
  }

  private async runMigration(migrationFile: string): Promise<void> {
    const startTime = Date.now();
    const migrationPath = path.join(__dirname, '../database/migrations', migrationFile);

    try {
      // Check if migration already ran
      const checkResult = await this.pool.query(
        'SELECT * FROM schema_migrations WHERE name = $1',
        [migrationFile]
      );

      if (checkResult.rows.length > 0) {
        logger.info(`Migration already executed: ${migrationFile}`);
        this.results.push({
          name: migrationFile,
          success: true,
          duration: 0,
        });
        return;
      }

      // Read and execute migration
      const sql = fs.readFileSync(migrationPath, 'utf-8');
      await this.pool.query(sql);

      // Record migration
      await this.pool.query('INSERT INTO schema_migrations (name) VALUES ($1)', [
        migrationFile,
      ]);

      const duration = Date.now() - startTime;
      logger.info(`Migration completed: ${migrationFile}`, { duration });

      this.results.push({
        name: migrationFile,
        success: true,
        duration,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      logger.error(`Migration failed: ${migrationFile}`, error as Error, { duration });

      this.results.push({
        name: migrationFile,
        success: false,
        error: errorMessage,
        duration,
      });
    }
  }

  private printResults(): void {
    console.log('\n=== Phase 1 Migration Results ===\n');

    for (const result of this.results) {
      const status = result.success ? '✓' : '✗';
      const icon = result.success ? '✓' : '✗';
      console.log(
        `${icon} ${result.name.padEnd(40)} ${result.duration.toString().padStart(5)}ms`
      );

      if (result.error) {
        console.log(`  Error: ${result.error}`);
      }
    }

    const successful = this.results.filter((r) => r.success).length;
    const total = this.results.length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(
      `\n${successful}/${total} migrations completed in ${totalDuration}ms\n`
    );
  }
}

// Run migrations
const runner = new MigrationRunner();
runner.run();
