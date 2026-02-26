/**
 * Merkezi hata yakalama middleware
 */
function errorHandler(err, _req, res, _next) {
  console.error('[ERROR]', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Sunucu hatası';
  const errorCode = err.errorCode || 'INTERNAL_ERROR';

  res.status(statusCode).json({
    success: false,
    message,
    error_code: errorCode,
  });
}

/**
 * Controller async fonksiyonlarını saran yardımcı
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Özel hata sınıfı
 */
class AppError extends Error {
  constructor(message, statusCode = 400, errorCode = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

module.exports = { errorHandler, asyncHandler, AppError };
