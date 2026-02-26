const BaseRepository = require('../repositories/BaseRepository');
const { AppError } = require('../middleware/errorHandler');

/**
 * Generic iş mantığı servisi
 * Tüm koleksiyonlar bu sınıfı kullanır
 */
class BaseService {
    /**
     * @param {string} tableName — tablo adı
     */
    constructor(tableName) {
        this.repo = new BaseRepository(tableName);
        this.tableName = tableName;
    }

    async getAll(publishedOnly = false) {
        return this.repo.findAll(publishedOnly);
    }

    async getById(id) {
        const record = await this.repo.findById(id);
        if (!record) {
            throw new AppError('Kayıt bulunamadı', 404, 'NOT_FOUND');
        }
        return record;
    }

    async create(data) {
        return this.repo.create(data);
    }

    async update(id, data) {
        const record = await this.repo.update(id, data);
        if (!record) {
            throw new AppError('Kayıt bulunamadı', 404, 'NOT_FOUND');
        }
        return record;
    }

    async delete(id) {
        const deleted = await this.repo.delete(id);
        if (!deleted) {
            throw new AppError('Kayıt bulunamadı', 404, 'NOT_FOUND');
        }
        return true;
    }

    async count() {
        return this.repo.count();
    }
}

module.exports = BaseService;
