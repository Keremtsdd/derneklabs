const { asyncHandler } = require('../middleware/errorHandler');
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

const getDashboardStats = asyncHandler(async (req, res) => {
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
        supportTickets: await supportTicketService.count()
    };
    res.json({ success: true, data: stats });
});

module.exports = { getDashboardStats };
