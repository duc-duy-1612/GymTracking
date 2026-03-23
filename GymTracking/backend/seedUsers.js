require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const users = [
  {
    name: 'Admin User',
    email: 'admin@gymtracking.com',
    password: 'password123',
    role: 'admin',
    gender: 'male',
    age: 25,
    measurements: { weight: 70, height: 175, waist: 80 },
    activityLevel: 1.55,
    goals: { targetType: 'maintain', targetWeight: 70, durationMonths: 3 }
  },
  {
    name: 'Test User 1',
    email: 'test@gymtracking.com',
    password: 'password123',
    role: 'user',
    gender: 'female',
    age: 22,
    measurements: { weight: 55, height: 160, waist: 65 },
    activityLevel: 1.375,
    goals: { targetType: 'cut', targetWeight: 50, durationMonths: 2 }
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthflow')
  .then(async () => {
    console.log('Connected to DB -> Seeding Users...');
    await User.deleteMany({});
    
    for (let u of users) {
      const salt = await bcrypt.genSalt(10);
      u.password = await bcrypt.hash(u.password, salt);
    }

    await User.insertMany(users);
    console.log('Seeded Users successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
