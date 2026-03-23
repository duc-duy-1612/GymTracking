require('dotenv').config();
const mongoose = require('mongoose');
const Instructor = require('./src/models/Instructor');

const instructors = [
  { name: 'John Doe', role: 'Head Coach', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b' },
  { name: 'Jane Smith', role: 'Yoga Instructor', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b' },
  { name: 'Mike Ross', role: 'Strength & Conditioning', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' },
  { name: 'Sarah Connor', role: 'Cardio Specialist', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a' }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthflow')
  .then(async () => {
    console.log('Connected to DB -> Seeding Instructors...');
    await Instructor.deleteMany({});
    await Instructor.insertMany(instructors);
    console.log('Seeded Instructors successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
