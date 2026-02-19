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
     * Boş string'leri null'a dönüştür — MySQL DATE/INT kolonları için gerekli
     */
    sanitize(data) {
        const clean = {};
        for (const [key, value] of Object.entries(data)) {
            if (value === '' || value === undefined) {
                clean[key] = null;
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
