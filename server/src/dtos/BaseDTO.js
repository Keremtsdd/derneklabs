/**
 * Genel CMS verileri için Data Transfer Object mapping sınıfı.
 * Veritabanı (snake_case) ile API / Frontend (camelCase) arasında koruma sağlar.
 */
class BaseDTO {
    /**
     * DB kaydını API yanıt formatına çevirir
     */
    static toResponse(entity) {
        if (!entity) return null;
        return {
            id: entity.id,
            title: entity.title,
            slug: entity.slug,
            shortDescription: entity.short_description || '',
            content: entity.content || '',
            image: entity.image || '',
            link: entity.link || '',
            dynamicProperties: typeof entity.dynamic_properties === 'string'
                ? (() => { try { return JSON.parse(entity.dynamic_properties); } catch { return {}; } })()
                : entity.dynamic_properties || {},
            isActive: Boolean(entity.is_active),
            sortOrder: Number(entity.sort_order || 0),
            createdAt: entity.created_at,
            updatedAt: entity.updated_at
        };
    }

    /**
     * API istek payload'unu DB kaydı formatına çevirir
     */
    static toEntity(dto) {
        if (!dto) return null;
        const entity = {};

        if (dto.title !== undefined) entity.title = dto.title;
        if (dto.slug !== undefined) entity.slug = dto.slug;
        if (dto.shortDescription !== undefined) entity.short_description = dto.shortDescription;
        if (dto.content !== undefined) entity.content = dto.content;
        if (dto.image !== undefined) entity.image = dto.image;
        if (dto.link !== undefined) entity.link = dto.link;
        if (dto.dynamicProperties !== undefined) {
            entity.dynamic_properties = typeof dto.dynamicProperties === 'object'
                ? JSON.stringify(dto.dynamicProperties)
                : dto.dynamicProperties;
        }
        if (dto.isActive !== undefined) entity.is_active = dto.isActive ? 1 : 0;
        if (dto.sortOrder !== undefined) entity.sort_order = Number(dto.sortOrder || 0);

        return entity;
    }
}

module.exports = BaseDTO;
