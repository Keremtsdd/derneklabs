/**
 * Merkezi hata yakalama middleware
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Sunucu hatası';
  const errorCode = err.errorCode || 'INTERNAL_ERROR';

  // Sadece sunucu kaynaklı 500 ve üzeri kritik hataları stack trace ile terminale yazdır.
  // 404 gibi istemci hataları terminali kirletmesin.
  if (statusCode >= 500) {
    const reqInfo = req ? `${req.method} ${req.originalUrl}` : 'Unknown Request';
    console.error(`[SERVER ERROR] [${reqInfo}]`, err.stack || err.message);
  }

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
