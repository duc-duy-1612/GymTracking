const CoachClass = require('../models/CoachClass');
const Instructor = require('../models/Instructor');
const Brand = require('../models/Brand');

const getClasses = async (req, res) => {
  try {
    const classes = await CoachClass.find().sort({ createdAt: -1 });
    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find().sort({ createdAt: -1 });
    res.json({ success: true, data: instructors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getClasses,
  getInstructors,
  getBrands,
};
