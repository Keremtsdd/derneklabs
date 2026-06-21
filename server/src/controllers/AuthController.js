const authService = require('../services/AuthService');
const { asyncHandler } = require('../middleware/errorHandler');
const { logActivity } = require('../utils/activityLogger');

/** POST /api/auth/login */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    // Aktiviteyi logla
    logActivity('Yönetim paneline giriş yapıldı', 'login');
    
    res.json({ success: true, data: result });
});

/** GET /api/auth/profile */
const getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user.id);
    res.json({ success: true, data: user });
});

module.exports = { login, getProfile };
