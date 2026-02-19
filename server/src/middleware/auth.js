const jwt = require('jsonwebtoken');

/**
 * JWT doğrulama middleware
 * Authorization: Bearer <token> header'ı gerektirir
 */
function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Yetkilendirme token\'ı bulunamadı',
      error_code: 'AUTH_TOKEN_MISSING',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.warn('[AUTH] Token doğrulama hatası:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Geçersiz veya süresi dolmuş token',
      error_code: 'AUTH_TOKEN_INVALID',
    });
  }
}

module.exports = auth;
