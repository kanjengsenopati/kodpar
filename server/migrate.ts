import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const { Pool } = pg;

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Neon
    }
  });

  try {
    console.log('🚀 [NEON-MIGRATOR] Starting database migration & seeding...');

    // 1. Read Schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('📄 Reading schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('✅ Schema applied successfully.');
    }

    // 2. Read Seed Data
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('🌱 Reading seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seedSql);
      console.log('✅ Seed data applied successfully.');
    }

    console.log('🎊 [NEON-MIGRATOR] Database is now fully synchronized with Single Source of Truth.');

  } catch (error: any) {
    console.error('❌ [NEON-MIGRATOR] Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
