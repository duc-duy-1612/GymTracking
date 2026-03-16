const express = require('express');
const router = express.Router();
const { getMe, updateProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

module.exports = router;
