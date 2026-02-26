const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/UserRepository');
const { AppError } = require('../middleware/errorHandler');

/**
 * Kimlik doğrulama servisi — login mantığı ve JWT üretimi
 */
class AuthService {
    /**
     * E-posta + şifre ile giriş yapar, JWT token döner
     */
    async login(email, password) {
        if (!email || !password) {
            throw new AppError('E-posta ve şifre gereklidir', 400, 'VALIDATION_ERROR');
        }

        const user = await userRepo.findByEmail(email);
        if (!user) {
            throw new AppError('E-posta veya şifre hatalı', 401, 'AUTH_INVALID_CREDENTIALS');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError('E-posta veya şifre hatalı', 401, 'AUTH_INVALID_CREDENTIALS');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    /** Token'daki kullanıcıyı getir */
    async getProfile(userId) {
        const user = await userRepo.findById(userId);
        if (!user) {
            throw new AppError('Kullanıcı bulunamadı', 404, 'USER_NOT_FOUND');
        }
        return user;
    }
}

module.exports = new AuthService();
