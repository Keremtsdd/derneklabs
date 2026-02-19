const pageRepo = require('../repositories/PageRepository');
const BaseService = require('./BaseService');
const { AppError } = require('../middleware/errorHandler');

/**
 * Sayfa servisi — slug tabanlı sorgular
 */
class PageService extends BaseService {
    constructor() {
        super('pages');
        this.pageRepo = pageRepo;
    }

    async getBySlug(slug) {
        const page = await this.pageRepo.findBySlug(slug);
        if (!page) {
            throw new AppError('Sayfa bulunamadı', 404, 'PAGE_NOT_FOUND');
        }
        return page;
    }

    async create(data) {
        if (!data.slug || !data.title) {
            throw new AppError('Slug ve title zorunludur', 400, 'VALIDATION_ERROR');
        }
        return this.pageRepo.create(data);
    }
}

module.exports = new PageService();
