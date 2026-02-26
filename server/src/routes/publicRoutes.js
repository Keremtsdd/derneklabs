const { Router } = require('express');
const {
    getCollection, getPages, getPageBySlug, getSettings, getKurumsalMenu,
} = require('../controllers/PublicController');

const router = Router();

// Site ayarları
router.get('/settings', getSettings);

// Kurumsal mega menü (navbar)
router.get('/kurumsal-menu', getKurumsalMenu);

// Sayfalar — slug ile tek sayfa (bu route collection'dan önce gelmeli)
router.get('/pages/:slug', getPageBySlug);

// Sayfalar — tüm sayfalar
router.get('/pages', getPages);

// Generic koleksiyonlar
router.get('/:collection', getCollection);

module.exports = router;
