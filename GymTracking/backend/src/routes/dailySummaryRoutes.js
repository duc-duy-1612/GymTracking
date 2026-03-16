const express = require('express');
const router = express.Router();
const { getToday, updateToday } = require('../controllers/dailySummaryController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/today', protect, getToday);
router.put('/today', protect, updateToday);

module.exports = router;
