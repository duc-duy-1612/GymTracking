const mongoose = require('mongoose');

const sleepLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  durationMinutes: { type: Number },
  quality: { type: String, enum: ['poor', 'fair', 'good', 'excellent'] },
  notes: { type: String, default: '' },
}, { timestamps: true, collection: 'sleep_logs' });

module.exports = mongoose.model('SleepLog', sleepLogSchema);
