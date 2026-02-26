const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cukurca_bel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

/**
 * Bağlantı havuzu sağlık kontrolü
 * Uygulama başlarken çağrılır
 */
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('[DB] MySQL bağlantısı başarılı —', process.env.DB_NAME);
    conn.release();
  } catch (error) {
    console.error('[DB] MySQL bağlantı hatası:', error.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
