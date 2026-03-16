const mongoose = require('mongoose');

const workoutExerciseSchema = new mongoose.Schema({
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  name: { type: String },
  muscleGroup: { type: String },
  type: { type: String },
  sets: { type: Number },
  repsMin: { type: Number },
  repsMax: { type: Number },
  weightKg: { type: Number },
  restSeconds: { type: Number },
  imageUrl: { type: String },
  completedSets: [{
    reps: { type: Number },
    weightKg: { type: Number },
  }],
}, { _id: true });

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  startedAt: { type: Date },
  endedAt: { type: Date },
  exercises: [workoutExerciseSchema],
  physicalCondition: {
    energyLevel: { type: Number, min: 1, max: 10 },
    injuryNotes: { type: String },
  },
  totalDurationMinutes: { type: Number },
}, { timestamps: true });

// Giữ tương thích: nếu không có exercises chi tiết, vẫn có muscleGroup + exercises cũ (name, sets, reps, weight)
workoutSchema.add({
  muscleGroup: { type: String },
});

module.exports = mongoose.model('Workout', workoutSchema);
