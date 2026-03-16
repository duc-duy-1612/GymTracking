const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  gender: { type: String, enum: ['male', 'female'] },
  age: { type: Number },
  measurements: {
    weight: { type: Number },
    height: { type: Number },
    waist: { type: Number },
  },
  activityLevel: { type: Number, default: 1.55 },
  goals: {
    targetType: { type: String, enum: ['cut', 'bulk', 'maintain'], default: 'cut' },
    targetWeight: Number,
    durationMonths: { type: Number, default: 3 },
  },
  autoStats: {
    bmr: Number,
    tdee: Number,
    bmi: Number,
    targetBmi: Number,
  },
}, { timestamps: true });

// BMI = cân nặng (kg) / (chiều cao (m))^2
// BMR/TDEE khi có đủ measurements, age, gender
userSchema.pre('save', function (next) {
  this.autoStats = this.autoStats || {};
  const w = this.measurements?.weight;
  const h = this.measurements?.height;
  if (w && h && h > 0) {
    this.autoStats.bmi = Math.round((w / ((h / 100) ** 2)) * 10) / 10;
  }
  const targetW = this.goals?.targetWeight;
  if (targetW != null && h && h > 0) {
    this.autoStats.targetBmi = Math.round((targetW / ((h / 100) ** 2)) * 10) / 10;
  }
  if (!w || !h || this.age == null || !this.gender) {
    return next();
  }
  let bmrCalc = (10 * w) + (6.25 * h) - (5 * this.age);
  bmrCalc = this.gender === 'male' ? bmrCalc + 5 : bmrCalc - 161;
  this.autoStats.bmr = Math.round(bmrCalc);
  this.autoStats.tdee = Math.round(bmrCalc * this.activityLevel);
  next();
});

module.exports = mongoose.model('User', userSchema);
