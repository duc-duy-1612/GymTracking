require('dotenv').config();
const mongoose = require('mongoose');
const CoachClass = require('./src/models/CoachClass');

const classes = [
  { title: 'Full Body HIIT', duration: '30 min', type: 'Workout', category: 'cardio', section: 'Fitness', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', videoUrl: '' },
  { title: 'Morning Yoga Flow', duration: '20 min', type: 'Yoga', category: 'mobility', section: 'Stress', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', videoUrl: '' },
  { title: 'Core Crusher', duration: '15 min', type: 'Workout', category: 'strength', section: 'Peloton', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', videoUrl: '' },
  { title: 'Mindful Sleep Meditation', duration: '10 min', type: 'Mindfulness', category: 'recovery', section: 'Sleep', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773', videoUrl: '' }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthflow')
  .then(async () => {
    console.log('Connected to DB -> Seeding Coach Classes...');
    await CoachClass.deleteMany({});
    await CoachClass.insertMany(classes);
    console.log('Seeded Coach Classes successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
