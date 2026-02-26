const NodeCache = require('node-cache');

/**
 * Bellek önbelleği — ayarlar için (Redis yoksa kullanılır).
 * Her sayfa yenilenmesinde DB'yi yormamak için ayarlar burada tutulur.
 * TTL: 1 saat (3600 saniye); ayar güncellenince flush edilir.
 */
const settingsCache = new NodeCache({
    stdTTL: 3600,
    checkperiod: 600,
    useClones: false,
});

const CACHE_KEY_SETTINGS = 'app_settings_all';

function getCachedSettings() {
    return settingsCache.get(CACHE_KEY_SETTINGS);
}

function setCachedSettings(data) {
    settingsCache.set(CACHE_KEY_SETTINGS, data);
}

function clearSettingsCache() {
    settingsCache.del(CACHE_KEY_SETTINGS);
}

module.exports = {
    getCachedSettings,
    setCachedSettings,
    clearSettingsCache,
};
