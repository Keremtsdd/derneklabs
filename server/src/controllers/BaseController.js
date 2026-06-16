const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Generic Controller sınıfı.
 * Ortak CRUD metodlarını sağlar ve DTO'ları kullanarak frontend'den DB'yi soyutlar.
 */
class BaseController {
    /**
     * @param {object} service - Servis sınıfı instance'ı
     * @param {object} dtoMapper - DTO mapping sınıfı
     */
    constructor(service, dtoMapper) {
        this.service = service;
        this.dtoMapper = dtoMapper;
    }

    /** GET / — Listeleme (Public ise sadece is_active=1, Admin ise tümü) */
    getAll = asyncHandler(async (req, res) => {
        const activeOnly = !req.user;
        const records = await this.service.getAll(activeOnly);
        const data = records.map((r) => this.dtoMapper.toResponse(r));
        res.json({ success: true, data });
    });

    /** GET /:idOrSlug — Detay getirme */
    getByIdOrSlug = asyncHandler(async (req, res) => {
        const { idOrSlug } = req.params;
        const record = await this.service.getByIdOrSlug(idOrSlug);

        // Public isteklerde pasif kayıtların görüntülenmesini engelle
        if (!req.user && !record.is_active) {
            return res.status(404).json({
                success: false,
                message: 'Kayıt bulunamadı',
                error_code: 'NOT_FOUND',
            });
        }

        res.json({ success: true, data: this.dtoMapper.toResponse(record) });
    });

    /** POST / — Yeni kayıt oluşturma (Admin yetkisi gerekir) */
    create = asyncHandler(async (req, res) => {
        const payload = { ...req.body };
        if (req.file) {
            payload.image = `/uploads/${req.file.filename}`;
        }

        const entityData = this.dtoMapper.toEntity(payload);
        const record = await this.service.create(entityData);
        res.status(201).json({ success: true, data: this.dtoMapper.toResponse(record) });
    });

    /** PUT /:id — Kayıt güncelleme (Admin yetkisi gerekir) */
    update = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const payload = { ...req.body };
        if (req.file) {
            payload.image = `/uploads/${req.file.filename}`;
        }

        const entityData = this.dtoMapper.toEntity(payload);
        const record = await this.service.update(id, entityData);
        res.json({ success: true, data: this.dtoMapper.toResponse(record) });
    });

    /** DELETE /:id — Kayıt silme (Admin yetkisi gerekir) */
    delete = asyncHandler(async (req, res) => {
        const { id } = req.params;
        await this.service.delete(id);
        res.json({ success: true, message: 'Kayıt başarıyla silindi' });
    });
}

module.exports = BaseController;
