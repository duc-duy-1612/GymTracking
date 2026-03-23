const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  type: { type: String, enum: ['Strength', 'Hypertrophy', 'Cardio', 'Mobility'], default: 'Strength' },
  targetMuscles: [{ type: String }],
  defaultSets: { type: Number, default: 4 },
  defaultRepsMin: { type: Number, default: 8 },
  defaultRepsMax: { type: Number, default: 12 },
  imageUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  restSeconds: { type: Number, default: 90 },
  caloriesPerSet: { type: Number, default: 15 },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Exercise', exerciseSchema);
