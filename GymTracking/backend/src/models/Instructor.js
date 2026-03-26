const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  specialty: {
    type: String,
    enum: ['fitness', 'yoga', 'cardio', 'mindfulness'],
    default: 'fitness',
  },
}, { timestamps: true });

module.exports = mongoose.model('Instructor', instructorSchema);
