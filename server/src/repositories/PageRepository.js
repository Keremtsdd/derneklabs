const { pool } = require('../config/database');
const BaseRepository = require('./BaseRepository');

/**
 * Sayfa repository — slug tabanlı sorgular
 */
class PageRepository extends BaseRepository {
    constructor() {
        super('pages');
    }

    async findBySlug(slug) {
        const [rows] = await pool.query(
            `SELECT * FROM pages WHERE slug = ? AND published = 1`,
            [slug]
        );
        return rows[0] || null;
    }
}

module.exports = new PageRepository();
