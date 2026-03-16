const express = require('express');
const router = express.Router();
const { getMe, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.put('/me/password', protect, changePassword);

module.exports = router;
