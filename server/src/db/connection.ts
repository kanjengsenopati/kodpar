import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

/**
 * NeonDB (PostgreSQL) Connection Pool
 * Configured with SSL requirement for cloud security.
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon serverless connections
  },
});

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected to NeonDB at:', res.rows[0].now);
  }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
