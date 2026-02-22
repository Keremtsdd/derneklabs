const { pool } = require('../config/database');

/**
 * Settings repository — key-value tablo işlemleri
 */
class SettingsRepository {
    async get(key) {
        const [rows] = await pool.query(
            `SELECT setting_value FROM settings WHERE setting_key = ?`,
            [key]
        );
        if (!rows[0]) return null;
        return rows[0].setting_value;
    }

    async set(key, value) {
        await pool.query(
            `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
            [key, JSON.stringify(value)]
        );
        return this.get(key);
    }

    async getAll() {
        const [rows] = await pool.query(`SELECT * FROM settings`);
        const result = {};
        for (const row of rows) {
            const val = row.setting_value;
            result[row.setting_key] = typeof val === 'string' ? (() => { try { return JSON.parse(val); } catch { return val; } })() : val;
        }
        return result;
    }

    /** Toplu güncelleme — birçok key-value tek seferde */
    async setBulk(settings) {
        if (!settings || typeof settings !== 'object') return;
        for (const [key, value] of Object.entries(settings)) {
            await this.set(key, value);
        }
    }
}

module.exports = new SettingsRepository();
