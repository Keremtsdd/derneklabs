const settingsRepo = require('../repositories/SettingsRepository');
const { getCachedSettings, setCachedSettings, clearSettingsCache } = require('../config/cache');

/** Ayar anahtarlarının grup ön eki (örn. general_, contact_) */
const GROUP_PREFIXES = ['general_', 'contact_', 'seo_', 'smtp_', 'api_', 'maintenance_'];

/**
 * Site ayarları servisi — cache ile.
 * Her sayfa yenilenmesinde DB'ye gitmemek için önce cache'e bakılır.
 * Panelden ayar kaydedilince cache temizlenir.
 */
class SettingsService {
    async getAll() {
        const cached = getCachedSettings();
        if (cached !== undefined) return cached;
        const data = await settingsRepo.getAll();
        setCachedSettings(data);
        return data;
    }

    async get(key) {
        const all = await this.getAll();
        return all[key] ?? null;
    }

    async set(key, value) {
        clearSettingsCache();
        return settingsRepo.set(key, value);
    }

    /** Toplu güncelleme — kayıt sonrası cache temizlenir */
    async setBulk(settings) {
        if (!settings || typeof settings !== 'object') return this.getAll();
        clearSettingsCache();
        await settingsRepo.setBulk(settings);
        return settingsRepo.getAll();
    }

    /**
     * Gruba göre ayarları getir (örn. ?group=general → general_ ile başlayanlar).
     * Cache'den okur, gruplu filtre burada yapılır.
     */
    async getByGroup(group) {
        const all = await this.getAll();
        if (!group) return all;
        const prefix = group.endsWith('_') ? group : `${group}_`;
        const result = {};
        for (const [key, value] of Object.entries(all)) {
            if (key.startsWith(prefix)) {
                result[key] = value;
            }
        }
        return result;
    }
}

module.exports = new SettingsService();
