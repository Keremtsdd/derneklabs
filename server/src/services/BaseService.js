const { AppError } = require('../middleware/errorHandler');
const slugify = require('../utils/slugify');

/**
 * Generic iş mantığı servisi
 */
class BaseService {
    /**
     * @param {object} repo - Repository instance'ı
     * @param {boolean} hasSlugField - Tablonun slug alanı olup olmadığı
     */
    constructor(repo, hasSlugField = false) {
        this.repo = repo;
        this.hasSlugField = hasSlugField;
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

    async getByIdOrSlug(idOrSlug) {
        const record = await this.repo.findByIdOrSlug(idOrSlug);
        if (!record) {
            throw new AppError('Kayıt bulunamadı', 404, 'NOT_FOUND');
        }
        return record;
    }

    async getBySlug(slug) {
        const record = await this.repo.findBySlug(slug);
        if (!record) {
            throw new AppError('Kayıt bulunamadı', 404, 'NOT_FOUND');
        }
        return record;
    }

    /** Benzersiz slug üretir */
    async generateUniqueSlug(title, excludeId = null) {
        const baseSlug = slugify(title);
        let uniqueSlug = baseSlug;
        let counter = 1;

        while (true) {
            const existing = await this.repo.findBySlug(uniqueSlug);
            if (!existing || existing.id === excludeId) {
                break;
            }
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }
        return uniqueSlug;
    }

    async create(data) {
        if (this.hasSlugField) {
            if (!data.slug && data.title) {
                data.slug = await this.generateUniqueSlug(data.title);
            } else if (data.slug) {
                data.slug = await this.generateUniqueSlug(data.slug);
            }
        }
        return this.repo.create(data);
    }

    async update(id, data) {
        const existingRecord = await this.repo.findById(id);
        if (!existingRecord) {
            throw new AppError('Kayıt bulunamadı', 404, 'NOT_FOUND');
        }

        if (this.hasSlugField) {
            if (data.slug) {
                data.slug = await this.generateUniqueSlug(data.slug, id);
            } else if (data.title && data.title !== existingRecord.title) {
                data.slug = await this.generateUniqueSlug(data.title, id);
            }
        }

        const record = await this.repo.update(id, data);
        if (!record) {
            throw new AppError('Kayıt güncellenemedi', 404, 'NOT_FOUND');
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
