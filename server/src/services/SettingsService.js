const settingsRepo = require('../repositories/SettingsRepository');

/**
 * Site ayarları servisi
 */
class SettingsService {
    async getAll() {
        return settingsRepo.getAll();
    }

    async get(key) {
        return settingsRepo.get(key);
    }

    async set(key, value) {
        return settingsRepo.set(key, value);
    }
}

module.exports = new SettingsService();
