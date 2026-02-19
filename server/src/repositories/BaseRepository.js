const { pool } = require('../config/database');
const { randomUUID } = require('crypto');

/**
 * Generic CRUD repository — tüm tablolar bu sınıfı miras alır.
 * SQL injection koruması: tüm sorgularda parameterized query kullanılır.
 */
class BaseRepository {
    /**
     * @param {string} tableName — MySQL tablo adı
     */
    constructor(tableName) {
        this.tableName = tableName;
    }

    /** Tüm kayıtları getir (opsiyonel: sadece published) */
    async findAll(publishedOnly = false) {
        let sql = `SELECT * FROM ?? ORDER BY created_at DESC`;
        const params = [this.tableName];

        if (publishedOnly) {
            sql = `SELECT * FROM ?? WHERE published = 1 ORDER BY created_at DESC`;
        }

        const [rows] = await pool.query(sql, params);
        return rows;
    }

    /** ID ile tek kayıt getir */
    async findById(id) {
        const [rows] = await pool.query(
            `SELECT * FROM ?? WHERE id = ?`,
            [this.tableName, id]
        );
        return rows[0] || null;
    }

    /**
     * DD.MM.YYYY -> YYYY-MM-DD dönüşümü
     */
    formatDate(value) {
        if (!value) return null;
        // Zaten YYYY-MM-DD formatındaysa dokunma
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value;

        // DD.MM.YYYY formatı kontrolü
        const parts = value.split('.');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return value;
    }

    /**
     * Verileri temizle ve formatla
     */
    sanitize(data) {
        const clean = {};
        for (const [key, value] of Object.entries(data)) {
            if (value === '' || value === undefined) {
                clean[key] = null;
            } else if (key === 'date' && typeof value === 'string') {
                clean[key] = this.formatDate(value);
            } else {
                clean[key] = value;
            }
        }
        return clean;
    }

    /** Yeni kayıt oluştur */
    async create(data) {
        const id = data.id || randomUUID();
        const record = this.sanitize({ id, ...data });
        await pool.query(`INSERT INTO ?? SET ?`, [this.tableName, record]);
        return this.findById(id);
    }

    /** Mevcut kaydı güncelle */
    async update(id, data) {
        const updateData = this.sanitize({ ...data, updated_at: new Date() });
        const [result] = await pool.query(
            `UPDATE ?? SET ? WHERE id = ?`,
            [this.tableName, updateData, id]
        );
        if (result.affectedRows === 0) return null;
        return this.findById(id);
    }

    /** Kaydı sil */
    async delete(id) {
        const [result] = await pool.query(
            `DELETE FROM ?? WHERE id = ?`,
            [this.tableName, id]
        );
        return result.affectedRows > 0;
    }

    /** Toplam kayıt sayısını getir */
    async count() {
        const [rows] = await pool.query(
            `SELECT COUNT(*) as total FROM ??`,
            [this.tableName]
        );
        return rows[0].total;
    }
}

module.exports = BaseRepository;
