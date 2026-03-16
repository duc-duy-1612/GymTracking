const DailySummary = require('../models/DailySummary');

const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const getToday = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());
    let summary = await DailySummary.findOne({ userId: req.user._id, date: today });
    if (!summary) {
      summary = await DailySummary.create({
        userId: req.user._id,
        date: today,
        waterMl: 0,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        exercisedToday: false,
      });
    }
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateToday = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());
    const allowed = ['waterMl', 'caloriesConsumed', 'caloriesBurned', 'sleepMinutes', 'sleepStart', 'sleepEnd', 'exercisedToday', 'mindfulMinutes', 'weightKg', 'glucoseMgDl'];
    const updates = { userId: req.user._id, date: today };
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const summary = await DailySummary.findOneAndUpdate(
      { userId: req.user._id, date: today },
      updates,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(summary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getToday, updateToday };
