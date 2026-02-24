/**
 * Database Connection Pool Management
 * Uses pg library for PostgreSQL connections via Neon
 */

import pg from 'pg';
const { Pool } = pg;

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients
  idleTimeoutMillis: 30000, // Close idle clients after 30s
  connectionTimeoutMillis: 2000, // Return an error after 2s if connection fails
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('[v0] Unexpected error on idle client', err);
});

/**
 * Execute a query with parameters
 * @param {string} query - SQL query string
 * @param {array} params - Query parameters
 * @returns {Promise} Query result
 */
export const query = async (query, params = []) => {
  const start = Date.now();
  
  try {
    const result = await pool.query(query, params);
    const duration = Date.now() - start;
    
    // Log slow queries (> 1 second)
    if (duration > 1000) {
      console.log('[v0] Slow query detected:', {
        query: query.substring(0, 100),
        duration: `${duration}ms`,
        rows: result.rowCount,
      });
    }
    
    return result;
  } catch (error) {
    console.error('[v0] Database query error:', {
      message: error.message,
      query: query.substring(0, 100),
      code: error.code,
    });
    throw error;
  }
};

/**
 * Get a client from the pool for transaction support
 * @returns {Promise} Database client
 */
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

/**
 * Health check - verify database connection
 * @returns {Promise<boolean>} True if database is accessible
 */
export const healthCheck = async () => {
  try {
    const result = await pool.query('SELECT 1');
    return result.rows.length > 0;
  } catch (error) {
    console.error('[v0] Database health check failed:', error.message);
    return false;
  }
};

/**
 * Get pool statistics
 * @returns {object} Pool information
 */
export const getPoolStats = () => {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
};

/**
 * Close the connection pool
 * Call this during application shutdown
 */
export const closePool = async () => {
  await pool.end();
  console.log('[v0] Database connection pool closed');
};

/**
 * Initialize database connection
 * Call this during application startup
 */
export const initDatabase = async () => {
  try {
    const isHealthy = await healthCheck();
    if (isHealthy) {
      console.log('[v0] Database connection established');
      return true;
    } else {
      console.error('[v0] Database health check failed');
      return false;
    }
  } catch (error) {
    console.error('[v0] Failed to initialize database:', error.message);
    return false;
  }
};

export default { query, getClient, healthCheck, getPoolStats, closePool, initDatabase };
