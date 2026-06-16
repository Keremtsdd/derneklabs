const { Router } = require('express');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const optionalAuth = require('../../middleware/optionalAuth');

const authController = require('../../controllers/AuthController');
const newsController = require('../../controllers/NewsController');
const announcementController = require('../../controllers/AnnouncementController');
const eventController = require('../../controllers/EventController');
const projectController = require('../../controllers/ProjectController');
const pageController = require('../../controllers/PageController');
const documentController = require('../../controllers/DocumentController');
const bannerController = require('../../controllers/BannerController');
const photoGalleryController = require('../../controllers/PhotoGalleryController');
const quickLinkController = require('../../controllers/QuickLinkController');
const supportTicketController = require('../../controllers/SupportTicketController');
const settingsController = require('../../controllers/SettingsController');
const dashboardController = require('../../controllers/DashboardController');

const router = Router();

/**
 * Yardımcı fonksiyon: Standart RESTful CRUD rotalarını kaydeder.
 * GET istekleri isteğe bağlı auth kullanır (taslakları görebilmek için).
 * Değişiklik yapan POST/PUT/DELETE istekleri zorunlu auth gerektirir.
 */
function registerCrud(path, controller) {
    router.get(path, optionalAuth, controller.getAll);
    router.get(`${path}/:idOrSlug`, optionalAuth, controller.getByIdOrSlug);
    router.post(path, auth, upload.single('image'), controller.create);
    router.put(`${path}/:id`, auth, upload.single('image'), controller.update);
    router.delete(`${path}/:id`, auth, controller.delete);
}

// Kimlik Doğrulama (Auth)
router.post('/auth/login', authController.login);
router.get('/auth/profile', auth, authController.getProfile);

// Dashboard İstatistikleri
router.get('/dashboard/stats', auth, dashboardController.getDashboardStats);

// Tek Dosya Yükleme (Medya)
router.post('/upload', auth, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Dosya yüklenemedi.' });
    res.json({ success: true, data: { url: `/uploads/${req.file.filename}` } });
});

// Ayarlar (Settings)
router.get('/settings', optionalAuth, settingsController.getSettings);
router.get('/settings/:key', optionalAuth, settingsController.getSettingByKey);
router.put('/settings', auth, settingsController.updateSettings);
router.put('/settings/:key', auth, settingsController.updateSettingByKey);

// Varlık Rotaları (RESTful CRUD)
registerCrud('/news', newsController);
registerCrud('/announcements', announcementController);
registerCrud('/events', eventController);
registerCrud('/projects', projectController);
registerCrud('/pages', pageController);
registerCrud('/documents', documentController);
registerCrud('/banners', bannerController);
registerCrud('/photo-gallery', photoGalleryController);
registerCrud('/quick-links', quickLinkController);
// Destek Talepleri (Support Tickets) - POST isteği herkese açıktır, diğerleri admin yetkisi gerektirir
router.get('/support-tickets', auth, supportTicketController.getAll);
router.get('/support-tickets/:idOrSlug', auth, supportTicketController.getByIdOrSlug);
router.post('/support-tickets', upload.single('image'), supportTicketController.create);
router.put('/support-tickets/:id', auth, upload.single('image'), supportTicketController.update);
router.delete('/support-tickets/:id', auth, supportTicketController.delete);

module.exports = router;
