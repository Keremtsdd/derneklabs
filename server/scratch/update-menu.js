const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateMenu() {
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'GucluSifre123',
    database: process.env.DB_NAME || 'cukurca_bel'
  };

  const newMenu = [
    { "title": "Anasayfa", "url": "/" },
    {
      "title": "Kurumsal",
      "url": "/sayfa/hakkimizda",
      "children": [
        { "title": "Hakkımızda", "url": "/sayfa/hakkimizda" },
        { "title": "Yönetim Kurulu", "url": "/sayfa/yonetim-kurulu" },
        { "title": "Dernek Tüzüğü", "url": "/sayfa/dernek-tuzugu" },
        { "title": "Gönüllülük", "url": "/sayfa/gonulluluk" }
      ]
    },
    {
      "title": "Çalışmalarımız",
      "url": "/projeler",
      "children": [
        { "title": "Sosyal Projeler", "url": "/projeler" },
        { "title": "Etkinlik Takvimi", "url": "/etkinlikler" }
      ]
    },
    {
      "title": "Güncel & Medya",
      "url": "/haberler",
      "children": [
        { "title": "Faaliyet Haberleri", "url": "/haberler" },
        { "title": "Duyurular", "url": "/duyurular" }
      ]
    },
    {
      "title": "İletişim",
      "url": "/iletisim"
    }
  ];

  let connection;
  try {
    connection = await mysql.createConnection(config);
    const jsonMenu = JSON.stringify(newMenu);
    await connection.query(
      `UPDATE settings SET setting_value = ? WHERE setting_key = 'navbar_menu'`,
      [jsonMenu]
    );
    console.log('[UPDATE] Successfully updated navbar_menu setting in database!');
    process.exit(0);
  } catch (err) {
    console.error('[UPDATE] Failed to update navbar_menu setting:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

updateMenu();
