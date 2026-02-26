const { Router } = require('express');
const { login, getProfile } = require('../controllers/AuthController');
const auth = require('../middleware/auth');

const router = Router();

router.post('/login', login);
router.get('/profile', auth, getProfile);

module.exports = router;
