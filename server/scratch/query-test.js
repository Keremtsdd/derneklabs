const { pool } = require('../src/config/database');

async function main() {
  try {
    const [rowsBefore] = await pool.query('SELECT * FROM settings');
    console.log('Before:', rowsBefore);

    const [newsRows] = await pool.query('SELECT COUNT(*) as count FROM news');
    console.log('News count:', newsRows[0].count);

    // Let's run a test insert
    await pool.query(`INSERT INTO settings (setting_key, setting_value) VALUES ('test_key', '{"hello": "world"}') ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`);
    const [rowsAfter] = await pool.query('SELECT * FROM settings');
    console.log('After:', rowsAfter);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

main();
