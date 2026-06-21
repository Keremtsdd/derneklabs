const settingsService = require('../services/SettingsService');
const { asyncHandler } = require('../middleware/errorHandler');
const { logActivity } = require('../utils/activityLogger');

const getSettings = asyncHandler(async (req, res) => {
    const { group } = req.query;
    const data = group ? await settingsService.getByGroup(group) : await settingsService.getAll();
    res.json({ success: true, data });
});

const getSettingByKey = asyncHandler(async (req, res) => {
    const { key } = req.params;
    const data = await settingsService.get(key);
    res.json({ success: true, data });
});

const updateSettings = asyncHandler(async (req, res) => {
    const { settings } = req.body;
    if (settings && typeof settings === 'object') {
        const data = await settingsService.setBulk(settings);
        
        // Aktiviteyi logla
        logActivity('Sistem ayarları güncellendi', 'settings');
        
        return res.json({ success: true, data });
    }
    const { key, value } = req.body;
    if (key !== undefined) {
        const data = await settingsService.set(key, value);
        
        // Aktiviteyi logla
        logActivity(`Sistem ayarı güncellendi: "${key}"`, 'settings');
        
        return res.json({ success: true, data });
    }
    res.status(400).json({ success: false, message: 'settings objesi veya key/value alanları gereklidir.' });
});

const updateSettingByKey = asyncHandler(async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;
    const data = await settingsService.set(key, value);
    
    // Aktiviteyi logla
    logActivity(`Sistem ayarı güncellendi: "${key}"`, 'settings');
    
    res.json({ success: true, data: data });
});

module.exports = { getSettings, getSettingByKey, updateSettings, updateSettingByKey };
