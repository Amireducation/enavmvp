// File: backend/libs/database/connection-pool.ts
// Purpose: Centralized database connection management with connection pooling
// Supports multiple service connections with proper isolation

import { Pool, PoolClient, PoolConfig } from 'pg';
import { environmentConfig } from '../../config/environment';
import { logger } from '../logging/logger';

export interface DatabaseConnectionOptions extends PoolConfig {
  serviceName?: string;
  schemaName?: string;
  role?: string;
}

class ConnectionPool {
  private pools: Map<string, Pool> = new Map();
  private defaultPool: Pool | null = null;

  constructor() {
    this.initializeDefaultPool();
  }

  private initializeDefaultPool(): void {
    const config: PoolConfig = {
      connectionString: environmentConfig.database.url,
      min: environmentConfig.database.poolMin,
      max: environmentConfig.database.poolMax,
      idleTimeoutMillis: environmentConfig.database.idleTimeout,
      connectionTimeoutMillis: environmentConfig.database.connectionTimeout,
      ssl: environmentConfig.database.ssl,
    };

    this.defaultPool = new Pool(config);

    // Error handling
    this.defaultPool.on('error', (err: Error) => {
      logger.error('Unexpected error on idle client', err);
    });

    logger.info('Default database connection pool initialized', {
      poolSize: config.max,
      service: 'database',
    });
  }

  getPool(serviceName?: string): Pool {
    if (!serviceName || serviceName === 'default') {
      return this.defaultPool!;
    }

    if (this.pools.has(serviceName)) {
      return this.pools.get(serviceName)!;
    }

    // Create service-specific pool
    const config: PoolConfig = {
      connectionString: environmentConfig.database.url,
      min: environmentConfig.database.poolMin,
      max: environmentConfig.database.poolMax,
      idleTimeoutMillis: environmentConfig.database.idleTimeout,
      connectionTimeoutMillis: environmentConfig.database.connectionTimeout,
      ssl: environmentConfig.database.ssl,
      application_name: `ethiopian-navigator-${serviceName}`,
    };

    const pool = new Pool(config);
    this.pools.set(serviceName, pool);

    logger.info('Service-specific connection pool created', {
      serviceName,
      poolSize: config.max,
    });

    return pool;
  }

  async getClient(serviceName?: string): Promise<PoolClient> {
    const pool = this.getPool(serviceName);
    return pool.connect();
  }

  async executeQuery<T>(
    query: string,
    params: any[] = [],
    serviceName?: string
  ): Promise<T[]> {
    const client = await this.getClient(serviceName);

    try {
      const result = await client.query(query, params);
      return result.rows;
    } catch (error) {
      logger.error('Database query failed', error as Error, {
        query: query.substring(0, 100),
        serviceName,
      });
      throw error;
    } finally {
      client.release();
    }
  }

  async executeTransaction<T>(
    callback: (client: PoolClient) => Promise<T>,
    serviceName?: string
  ): Promise<T> {
    const client = await this.getClient(serviceName);

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Transaction failed', error as Error, {
        serviceName,
      });
      throw error;
    } finally {
      client.release();
    }
  }

  async closeAll(): Promise<void> {
    const allPools = [this.defaultPool, ...Array.from(this.pools.values())];

    for (const pool of allPools) {
      if (pool) {
        try {
          await pool.end();
          logger.info('Connection pool closed');
        } catch (error) {
          logger.error('Error closing pool', error as Error);
        }
      }
    }

    this.pools.clear();
  }

  async healthCheck(serviceName?: string): Promise<boolean> {
    try {
      const result = await this.executeQuery<{ now: string }>('SELECT NOW()', [], serviceName);
      return result.length > 0;
    } catch (error) {
      logger.error('Database health check failed', error as Error);
      return false;
    }
  }
}

export const connectionPool = new ConnectionPool();
export default connectionPool;
