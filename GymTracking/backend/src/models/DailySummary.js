const mongoose = require('mongoose');

const dailySummarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  waterMl: { type: Number, default: 0 },
  caloriesConsumed: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  sleepMinutes: { type: Number },
  sleepStart: { type: Date },
  sleepEnd: { type: Date },
  exercisedToday: { type: Boolean, default: false },
  mindfulMinutes: { type: Number, default: 0 },
  weightKg: { type: Number },
  glucoseMgDl: { type: Number },
  glucoseConsumed: { type: Number, default: 0 },
}, { timestamps: true, collection: 'daily_summaries' });

dailySummarySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailySummary', dailySummarySchema);
