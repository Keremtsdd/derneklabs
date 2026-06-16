const jwt = require('jsonwebtoken');

/**
 * İsteğe bağlı JWT doğrulama middleware.
 * Eğer Authorization header'ı varsa doğrular ve req.user'ı doldurur.
 * Token yoksa veya geçersizse hata vermez, sadece req.user boş kalır.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Geçersiz token durumunda sessizce yoksay ve devam et
      console.warn('[OPTIONAL-AUTH] Geçersiz token denemesi:', error.message);
    }
  }

  next();
}

module.exports = optionalAuth;
