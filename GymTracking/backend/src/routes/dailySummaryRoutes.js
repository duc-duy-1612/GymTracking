const express = require('express');
const router = express.Router();
const { getToday, updateToday, getHistory } = require('../controllers/dailySummaryController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/today', protect, getToday);
router.put('/today', protect, updateToday);
router.get('/', protect, getHistory);

module.exports = router;
