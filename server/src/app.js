const express = require('express');
const cors = require('cors');
const path = require('path');
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorHandler');

function createApp() {
    const app = express();

    // CORS
    const allowedOrigins = (process.env.CORS_ORIGIN || '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);

    app.use(cors({
        origin: allowedOrigins.length
            ? (origin, cb) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    cb(null, true);
                } else {
                    cb(new Error('CORS izin verilmedi'));
                }
            }
            : true,
        credentials: true,
    }));

    // Body parsers
    app.use(express.json({ limit: '5mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Static dosyalar
    const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
    app.use('/uploads', express.static(path.resolve(UPLOAD_DIR)));

    // Route'lar
    app.use('/api/public', publicRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);

    // Sağlık kontrolü
    app.get('/api/health', (_req, res) => {
        res.json({ success: true, message: 'API çalışıyor', timestamp: new Date().toISOString() });
    });

    // Merkezi hata yakalama (en son)
    app.use(errorHandler);

    return app;
}

module.exports = createApp;
