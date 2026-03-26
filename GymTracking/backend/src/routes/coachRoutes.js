const express = require('express');
const router = express.Router();
const { getClasses, getInstructors, getBrands, getClassesByInstructor } = require('../controllers/coachController');

router.get('/classes', getClasses);
router.get('/classes/by-instructor/:instructorId', getClassesByInstructor);
router.get('/instructors', getInstructors);
router.get('/brands', getBrands);

module.exports = router;

