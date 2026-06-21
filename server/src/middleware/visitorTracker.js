const { pool } = require('../config/database');

/**
 * Ziyaretçi takibi middleware'i.
 * Public isteklerde (anasayfa, ayarlar, koleksiyonlar) tetiklenerek benzersiz ziyaretçileri loglar.
 */
const trackVisitor = (req, res, next) => {
    try {
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '127.0.0.1';
        
        // IPv4 mapped IPv6 adresini temizle
        if (ip.includes('::ffff:')) {
            ip = ip.replace('::ffff:', '');
        }
        
        // İstek akışını engellememek için sorguyu async başlatıp hata durumunda catch ediyoruz
        pool.query(
            'INSERT IGNORE INTO visitor_logs (ip_address, visit_date) VALUES (?, CURDATE())',
            [ip]
        ).catch((err) => {
            console.error('[Visitor Tracker] Log yazma hatası:', err.message);
        });
    } catch (err) {
        console.error('[Visitor Tracker] Beklenmedik hata:', err.message);
    }
    next();
};

module.exports = trackVisitor;
