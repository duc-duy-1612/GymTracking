const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createWorkout,
  getWorkoutsHistory,
  getExercises
} = require('../controllers/workoutController');

// @route   GET /api/workouts/exercises
// @desc    Lấy danh sách bài tập khả dụng
router.get('/exercises', protect, getExercises);

// @route   POST /api/workouts
// @desc    Lưu lịch sử bài tập
router.post('/', protect, createWorkout);

// @route   GET /api/workouts/history
// @desc    Lấy lịch sử các buổi tập của user
router.get('/history', protect, getWorkoutsHistory);

module.exports = router;
