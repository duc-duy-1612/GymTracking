const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['weight', 'glucose', 'mindful', 'waist'], required: true },
  value: { type: Number, required: true },
  unit: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true, collection: 'health_logs' });

module.exports = mongoose.model('HealthLog', healthLogSchema);
