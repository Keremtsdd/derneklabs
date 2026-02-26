const BaseService = require('../services/BaseService');
const pageService = require('../services/PageService');
const settingsService = require('../services/SettingsService');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Admin controller — CRUD endpoint'leri (auth middleware ile korunur)
 */

const COLLECTIONS = [
    'news', 'announcements', 'events', 'banners',
    'notices', 'documents', 'projects', 'fast_links', 'videos',
];

const services = {};
COLLECTIONS.forEach((col) => {
    services[col] = new BaseService(col);
});

/** GET /api/admin/:collection — tüm kayıtlar (published + unpublished) */
const getAll = asyncHandler(async (req, res) => {
    const { collection } = req.params;
    if (!COLLECTIONS.includes(collection)) {
        return res.status(404).json({
            success: false,
            message: 'Koleksiyon bulunamadı',
            error_code: 'COLLECTION_NOT_FOUND',
        });
    }
    const data = await services[collection].getAll(false);
    res.json({ success: true, data });
});

/** GET /api/admin/:collection/:id */
const getById = asyncHandler(async (req, res) => {
    const { collection, id } = req.params;
    if (!COLLECTIONS.includes(collection)) {
        return res.status(404).json({
            success: false,
            message: 'Koleksiyon bulunamadı',
            error_code: 'COLLECTION_NOT_FOUND',
        });
    }
    const data = await services[collection].getById(id);
    res.json({ success: true, data });
});

/** POST /api/admin/:collection */
const create = asyncHandler(async (req, res) => {
    const { collection } = req.params;
    if (!COLLECTIONS.includes(collection)) {
        return res.status(404).json({
            success: false,
            message: 'Koleksiyon bulunamadı',
            error_code: 'COLLECTION_NOT_FOUND',
        });
    }
    const body = { ...req.body };
    if (req.file) {
        body.image = `/uploads/${req.file.filename}`;
    }
    const data = await services[collection].create(body);
    res.status(201).json({ success: true, data });
});

/** PUT /api/admin/:collection/:id */
const update = asyncHandler(async (req, res) => {
    const { collection, id } = req.params;
    if (!COLLECTIONS.includes(collection)) {
        return res.status(404).json({
            success: false,
            message: 'Koleksiyon bulunamadı',
            error_code: 'COLLECTION_NOT_FOUND',
        });
    }
    const body = { ...req.body };
    if (req.file) {
        body.image = `/uploads/${req.file.filename}`;
    }
    const data = await services[collection].update(id, body);
    res.json({ success: true, data });
});

/** DELETE /api/admin/:collection/:id */
const remove = asyncHandler(async (req, res) => {
    const { collection, id } = req.params;
    if (!COLLECTIONS.includes(collection)) {
        return res.status(404).json({
            success: false,
            message: 'Koleksiyon bulunamadı',
            error_code: 'COLLECTION_NOT_FOUND',
        });
    }
    await services[collection].delete(id);
    res.json({ success: true, message: 'Kayıt silindi' });
});

// ─── Pages CRUD ───

const getAllPages = asyncHandler(async (_req, res) => {
    const data = await pageService.getAll(false);
    res.json({ success: true, data });
});

const getPageById = asyncHandler(async (req, res) => {
    const data = await pageService.getById(req.params.id);
    res.json({ success: true, data });
});

const createPage = asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (req.file) body.image = `/uploads/${req.file.filename}`;
    const data = await pageService.create(body);
    res.status(201).json({ success: true, data });
});

const updatePage = asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (req.file) body.image = `/uploads/${req.file.filename}`;
    const data = await pageService.update(req.params.id, body);
    res.json({ success: true, data });
});

const deletePage = asyncHandler(async (req, res) => {
    await pageService.delete(req.params.id);
    res.json({ success: true, message: 'Sayfa silindi' });
});

// ─── Settings ───

/** GET /api/admin/settings — tümü veya ?group=general ile gruplu */
const getSettings = asyncHandler(async (req, res) => {
    const group = req.query.group;
    const data = group ? await settingsService.getByGroup(group) : await settingsService.getAll();
    res.json({ success: true, data });
});

/** PUT /api/admin/settings — toplu güncelleme. Body: { settings: { key: value, ... } } */
const updateSettings = asyncHandler(async (req, res) => {
    const { settings: settingsPayload } = req.body;
    if (settingsPayload && typeof settingsPayload === 'object') {
        const data = await settingsService.setBulk(settingsPayload);
        return res.json({ success: true, data });
    }
    const { key, value } = req.body;
    if (key != null) {
        const data = await settingsService.set(key, value);
        return res.json({ success: true, data });
    }
    res.status(400).json({ success: false, message: 'settings objesi veya key/value gerekli' });
});

// ─── Dashboard istatistikleri ───

const getDashboardStats = asyncHandler(async (_req, res) => {
    const stats = {};
    for (const col of COLLECTIONS) {
        stats[col] = await services[col].count();
    }
    stats.pages = await pageService.count();
    res.json({ success: true, data: stats });
});

module.exports = {
    getAll, getById, create, update, remove,
    getAllPages, getPageById, createPage, updatePage, deletePage,
    getSettings, updateSettings,
    getDashboardStats,
};
