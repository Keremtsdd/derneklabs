const { Router } = require('express');
const {
    getCollection, getPages, getPageBySlug, getSettings,
} = require('../controllers/PublicController');

const router = Router();

// Site ayarları
router.get('/settings', getSettings);

// Sayfalar — slug ile tek sayfa (bu route collection'dan önce gelmeli)
router.get('/pages/:slug', getPageBySlug);

// Sayfalar — tüm sayfalar
router.get('/pages', getPages);

// Generic koleksiyonlar
router.get('/:collection', getCollection);

module.exports = router;
