const express = require('express');
const router = express.Router();
const { addWeightLog, getWeightHistory } = require('../controllers/healthLogController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', addWeightLog);
router.get('/weight', getWeightHistory);

module.exports = router;
