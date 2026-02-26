const BaseService = require('../services/BaseService');
const pageService = require('../services/PageService');
const settingsService = require('../services/SettingsService');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Public controller — herkesin erişebildiği GET endpoint'leri
 * HTTP status/response burada yönetilir, iş mantığı Service'de
 */

const COLLECTIONS = [
    'news', 'announcements', 'events', 'banners',
    'notices', 'documents', 'projects', 'fast_links', 'videos',
];

// Her koleksiyon için service instance'ı oluştur
const services = {};
COLLECTIONS.forEach((col) => {
    services[col] = new BaseService(col);
});

/** GET /api/public/:collection — tüm kayıtlar (published) */
const getCollection = asyncHandler(async (req, res) => {
    const { collection } = req.params;
    if (!COLLECTIONS.includes(collection)) {
        return res.status(404).json({
            success: false,
            message: 'Koleksiyon bulunamadı',
            error_code: 'COLLECTION_NOT_FOUND',
        });
    }

    const data = await services[collection].getAll(true);
    res.json({ success: true, data });
});

/** GET /api/public/pages — tüm sayfalar (published) */
const getPages = asyncHandler(async (_req, res) => {
    const data = await pageService.getAll(true);
    res.json({ success: true, data });
});

/** GET /api/public/pages/:slug — slug ile tek sayfa */
const getPageBySlug = asyncHandler(async (req, res) => {
    const data = await pageService.getBySlug(req.params.slug);
    res.json({ success: true, data });
});

/** GET /api/public/settings — site ayarları */
const getSettings = asyncHandler(async (_req, res) => {
    const data = await settingsService.getAll();
    res.json({ success: true, data });
});

/** GET /api/public/kurumsal-menu — Kurumsal mega menü içeriği (navbar) */
const getKurumsalMenu = asyncHandler(async (_req, res) => {
    const all = await settingsService.getAll();
    const data = all.kurumsal_megamenu || null;
    res.json({ success: true, data });
});

module.exports = { getCollection, getPages, getPageBySlug, getSettings, getKurumsalMenu };
