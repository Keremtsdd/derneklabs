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

    /** Tüm kayıtları getir (opsiyonel: sadece aktif olanlar) */
    async findAll(activeOnly = false) {
        const orderBy = (this.tableName === 'quick_links' || this.tableName === 'banners')
            ? 'ORDER BY sort_order ASC, created_at DESC'
            : 'ORDER BY created_at DESC';
        let sql = `SELECT * FROM ?? ${orderBy}`;
        const params = [this.tableName];

        if (activeOnly) {
            sql = `SELECT * FROM ?? WHERE is_active = 1 ${orderBy}`;
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

    /** Slug ile tek kayıt getir */
    async findBySlug(slug) {
        const [rows] = await pool.query(
            `SELECT * FROM ?? WHERE slug = ?`,
            [this.tableName, slug]
        );
        return rows[0] || null;
    }

    /** ID veya Slug ile tek kayıt getir */
    async findByIdOrSlug(idOrSlug) {
        const [rows] = await pool.query(
            `SELECT * FROM ?? WHERE id = ? OR slug = ?`,
            [this.tableName, idOrSlug, idOrSlug]
        );
        return rows[0] || null;
    }

    /** Verileri temizle ve formatla */
    sanitize(data) {
        const clean = {};
        for (const [key, value] of Object.entries(data)) {
            if (value === undefined) {
                continue;
            }
            if (key === 'dynamic_properties') {
                if (typeof value === 'object' && value !== null) {
                    clean[key] = JSON.stringify(value);
                } else {
                    clean[key] = value;
                }
            } else if (key === 'is_active') {
                clean[key] = value ? 1 : 0;
            } else {
                clean[key] = value === '' ? null : value;
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
