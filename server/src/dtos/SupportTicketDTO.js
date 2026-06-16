/**
 * Destek talepleri için Data Transfer Object mapping sınıfı.
 */
class SupportTicketDTO {
    /**
     * DB kaydını API yanıt formatına çevirir
     */
    static toResponse(entity) {
        if (!entity) return null;
        return {
            id: entity.id,
            userContact: entity.user_contact,
            subject: entity.subject,
            message: entity.message,
            status: entity.status,
            dynamicProperties: typeof entity.dynamic_properties === 'string'
                ? (() => { try { return JSON.parse(entity.dynamic_properties); } catch { return {}; } })()
                : entity.dynamic_properties || {},
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

        if (dto.userContact !== undefined) entity.user_contact = dto.userContact;
        else if (dto.user_contact !== undefined) entity.user_contact = dto.user_contact;

        if (dto.subject !== undefined) entity.subject = dto.subject;
        if (dto.message !== undefined) entity.message = dto.message;
        if (dto.status !== undefined) entity.status = dto.status;
        if (dto.dynamicProperties !== undefined) {
            entity.dynamic_properties = typeof dto.dynamicProperties === 'object'
                ? JSON.stringify(dto.dynamicProperties)
                : dto.dynamicProperties;
        }

        return entity;
    }
}

module.exports = SupportTicketDTO;
