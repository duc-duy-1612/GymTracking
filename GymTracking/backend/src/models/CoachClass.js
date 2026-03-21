const mongoose = require('mongoose');

const coachClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., '20 min'
  type: { type: String, required: true },     // e.g., 'Workout', 'Yoga', 'Mindfulness'
  category: { type: String, required: true }, // e.g., 'mobility', 'cardio', 'strength'
  section: { type: String, required: true },  // e.g., 'Peloton', 'Sleep', 'Stress', 'Fitness'
  image: { type: String, required: true },
  videoUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('CoachClass', coachClassSchema);
