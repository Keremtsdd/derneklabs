const { Router } = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    getAll, getById, create, update, remove,
    getAllPages, getPageById, createPage, updatePage, deletePage,
    getSettings, updateSettings,
    getDashboardStats,
} = require('../controllers/AdminController');

const router = Router();

// Tüm admin route'ları JWT ile korunur
router.use(auth);

// Dashboard istatistikleri
router.get('/dashboard/stats', getDashboardStats);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Pages CRUD
router.get('/pages', getAllPages);
router.get('/pages/:id', getPageById);
router.post('/pages', upload.single('image'), createPage);
router.put('/pages/:id', upload.single('image'), updatePage);
router.delete('/pages/:id', deletePage);

// Generic koleksiyonlar CRUD
router.get('/:collection', getAll);
router.get('/:collection/:id', getById);
router.post('/:collection', upload.single('image'), create);
router.put('/:collection/:id', upload.single('image'), update);
router.delete('/:collection/:id', remove);

module.exports = router;
