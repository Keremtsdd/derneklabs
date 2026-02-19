require('dotenv').config();
const createApp = require('./src/app');
const { testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 4000;

async function start() {
  // Veritabanı bağlantısını doğrula
  await testConnection();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`[SERVER] API çalışıyor — http://localhost:${PORT}`);
    console.log(`[SERVER] Public  → /api/public/:collection`);
    console.log(`[SERVER] Auth    → /api/auth/login`);
    console.log(`[SERVER] Admin   → /api/admin/:collection (JWT gerekli)`);
  });
}

start().catch((error) => {
  console.error('[SERVER] Başlatma hatası:', error.message);
  process.exit(1);
});
