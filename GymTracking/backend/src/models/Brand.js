const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true }, // e.g., 'bi bi-apple'
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);
