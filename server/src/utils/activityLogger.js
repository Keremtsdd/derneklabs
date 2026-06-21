const { pool } = require('../config/database');

/**
 * Yönetici aktivitelerini veritabanına loglar.
 * @param {string} description - Aktivite açıklaması (Örn: "Yönetim paneline giriş yapıldı")
 * @param {string} activity_type - Aktivite tipi ('login', 'settings', 'sync', 'create', 'update', 'delete')
 */
async function logActivity(description, activity_type) {
    try {
        await pool.query(
            'INSERT INTO activity_logs (description, activity_type) VALUES (?, ?)',
            [description, activity_type]
        );
    } catch (err) {
        console.error('[Activity Logger] Hata:', err.message);
    }
}

module.exports = { logActivity };
