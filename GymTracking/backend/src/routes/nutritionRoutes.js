const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  addMeal,
  getNutritionHistory,
  deleteMeal,
  getFoods,
  createFood
} = require('../controllers/nutritionController');

// @route   POST /api/nutrition/foods
// @desc    Tạo món ăn riêng của người dùng
router.post('/foods', protect, createFood);

// @route   GET /api/nutrition/foods
// @desc    Lấy danh sách món ăn mẫu (tra cứu calo)
router.get('/foods', protect, getFoods);

// @route   POST /api/nutrition
// @desc    Thêm mới một bữa ăn
router.post('/', protect, addMeal);

// @route   GET /api/nutrition/history
// @desc    Lấy danh sách các bữa ăn đã nhập
router.get('/history', protect, getNutritionHistory);

// @route   DELETE /api/nutrition/:id
// @desc    Xóa một bữa ăn
router.delete('/:id', protect, deleteMeal);

module.exports = router;
