const { pool } = require('../config/database');

/**
 * Kullanıcı repository — e-posta ile arama desteği
 */
class UserRepository {
    async findByEmail(email) {
        const [rows] = await pool.query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );
        return rows[0] || null;
    }

    async findById(id) {
        const [rows] = await pool.query(
            `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }
}

module.exports = new UserRepository();
