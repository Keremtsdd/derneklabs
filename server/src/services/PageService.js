const pageRepo = require('../repositories/PageRepository');
const BaseService = require('./BaseService');
const BaseRepository = require('../repositories/BaseRepository');

class PageService extends BaseService {
    constructor() {
        super(pageRepo, true);
    }

    async getBySlug(slug) {
        // Önce pages tablosunda ara
        try {
            return await super.getBySlug(slug);
        } catch (error) {
            // Eğer 404 değilse üst sınıftaki hatayı fırlat
            if (error.statusCode !== 404) throw error;

            // Bulunamazsa diğer ilgili tablolarda ara
            const fallbackTables = ['news', 'announcements', 'events', 'projects'];
            for (const table of fallbackTables) {
                const tempRepo = new BaseRepository(table);
                const record = await tempRepo.findBySlug(slug);
                if (record) {
                    return {
                        ...record,
                        type: table
                    };
                }
            }
            throw error; // Hiçbirinde bulunamazsa orijinal 404 hatasını fırlat
        }
    }
}

module.exports = new PageService();
