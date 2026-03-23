const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  foodItem: { type: String, required: true },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Pre-workout', 'Post-workout', 'Snack'],
    required: true,
  },
  macros: {
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    glucose: { type: Number, default: 0 },
  },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: 'portion' },
}, { timestamps: true });

module.exports = mongoose.model('Nutrition', nutritionSchema);