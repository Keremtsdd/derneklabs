const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { pool } = require('../src/config/database');

// Ensure database exists before checking/connecting with the pool
async function ensureDatabaseExists() {
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };

  let connection;
  try {
    connection = await mysql.createConnection(config);
    const dbName = process.env.DB_NAME || 'cukurca_bel';
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`[SEED] Ensured database exists: ${dbName}`);
  } catch (err) {
    console.error('[SEED] Failed to ensure database exists:', err.message);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

// Check if database is empty by looking for users table and its rows
async function isDatabaseEmpty() {
  const connection = await pool.getConnection();
  try {
    const dbName = process.env.DB_NAME || 'cukurca_bel';
    
    // Check if table 'users' exists
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [dbName]);

    if (tables.length === 0) {
      // 'users' table doesn't exist, schema needs to run
      return true;
    }

    // Check if table 'users' has data
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
    return rows[0].count === 0;
  } catch (err) {
    console.log('[SEED] Database empty check error (assuming empty):', err.message);
    return true;
  } finally {
    connection.release();
  }
}

async function runSqlFile(filePath) {
  console.log(`[SEED] Reading SQL file: ${filePath}`);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  const statements = sql
    .split(/;\s*$/m)
    .map(q => {
      return q
        .split('\n')
        .filter(line => !line.trim().startsWith('--') && !line.trim().startsWith('#'))
        .join('\n')
        .trim();
    })
    .filter(q => q.length > 0);

  const connection = await pool.getConnection();
  try {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    for (const statement of statements) {
      const upperStatement = statement.toUpperCase();
      if (
        upperStatement.startsWith('DROP DATABASE') ||
        upperStatement.startsWith('CREATE DATABASE') ||
        upperStatement.startsWith('USE ')
      ) {
        continue;
      }

      try {
        await connection.query(statement);
      } catch (err) {
        console.error(`[SEED] Error executing statement:\n${statement}\nError: ${err.message}`);
        throw err;
      }
    }
    
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log(`[SEED] Successfully executed: ${path.basename(filePath)}`);
  } finally {
    connection.release();
  }
}

async function main() {
  try {
    // 1. First ensure database exists
    await ensureDatabaseExists();

    // 2. Check if database is empty (no users table or 0 users)
    const empty = await isDatabaseEmpty();
    if (!empty) {
      console.log('[SEED] Database already contains data. Skipping seeding lifecycle to preserve admin modifications.');
      process.exit(0);
    }

    console.log('[SEED] Seeding is required. Initializing database schema and seed data...');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const seedPath = path.join(__dirname, '../database/seed.sql');
    
    await runSqlFile(schemaPath);
    await runSqlFile(seedPath);
    console.log('[SEED] Database setup complete with strict UTF-8 encoding.');
    process.exit(0);
  } catch (err) {
    console.error('[SEED] Database setup failed:', err);
    process.exit(1);
  }
}

main();
