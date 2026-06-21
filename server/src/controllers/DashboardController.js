const { asyncHandler } = require('../middleware/errorHandler');
const { pool } = require('../config/database');
const newsService = require('../services/NewsService');
const announcementService = require('../services/AnnouncementService');
const eventService = require('../services/EventService');
const projectService = require('../services/ProjectService');
const pageService = require('../services/PageService');
const documentService = require('../services/DocumentService');
const bannerService = require('../services/BannerService');
const photoGalleryService = require('../services/PhotoGalleryService');
const quickLinkService = require('../services/QuickLinkService');
const supportTicketService = require('../services/SupportTicketService');
const noticeService = require('../services/NoticeService');

const getDashboardStats = asyncHandler(async (req, res) => {
    const [todayRow] = await pool.query('SELECT COUNT(*) as total FROM visitor_logs WHERE visit_date = CURDATE()');
    const [totalRow] = await pool.query('SELECT COUNT(*) as total FROM visitor_logs');

    const stats = {
        news: await newsService.count(),
        announcements: await announcementService.count(),
        events: await eventService.count(),
        projects: await projectService.count(),
        pages: await pageService.count(),
        documents: await documentService.count(),
        banners: await bannerService.count(),
        photoGallery: await photoGalleryService.count(),
        quickLinks: await quickLinkService.count(),
        supportTickets: await supportTicketService.count(),
        notices: await noticeService.count(),
        visitorsToday: todayRow[0]?.total || 0,
        visitorsTotal: totalRow[0]?.total || 0
    };
    res.json({ success: true, data: stats });
});

const getRecentActivities = asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
        'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10'
    );
    res.json({ success: true, data: rows });
});

const syncInstagram = asyncHandler(async (req, res) => {
    const { logActivity } = require('../utils/activityLogger');
    await logActivity('Site içerikleri senkronize edildi', 'sync');
    res.json({ success: true, message: 'İçerikler başarıyla senkronize edildi' });
});

module.exports = { getDashboardStats, getRecentActivities, syncInstagram };
