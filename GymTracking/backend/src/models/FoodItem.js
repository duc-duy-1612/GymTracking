const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  glucose: { type: Number, default: 0 },
  category: { type: String, default: 'Chung' }, // VN, KR, JP, US, IT, v.v.
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
