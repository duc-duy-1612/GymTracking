const express = require('express');
const router = express.Router();
const { getClasses, getInstructors, getBrands } = require('../controllers/coachController');

router.get('/classes', getClasses);
router.get('/instructors', getInstructors);
router.get('/brands', getBrands);

module.exports = router;
