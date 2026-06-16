const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/database');

async function debug() {
  const seedPath = path.join(__dirname, '../database/seed.sql');
  const sql = fs.readFileSync(seedPath, 'utf8');
  
  const statements = sql
    .split(/;\s*$/m)
    .map(q => q.trim())
    .filter(q => q.length > 0 && !q.startsWith('--'));

  console.log('Total statements parsed:', statements.length);
  
  const conn = await pool.getConnection();
  try {
    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i]
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .trim();

      if (!statement) continue;
      
      console.log(`Executing [${i}]:`, statement.substring(0, 100) + '...');
      const [res] = await conn.query(statement);
      console.log('Result:', res);
    }
  } catch (err) {
    console.error('Error at statement:', err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

debug();
