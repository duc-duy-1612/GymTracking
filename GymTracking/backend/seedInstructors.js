require('dotenv').config();
const mongoose = require('mongoose');
const Instructor = require('./src/models/Instructor');

const instructors = [
  // ---- FITNESS / STRENGTH ----
  {
    name: 'Denise Cardenas',
    role: 'Fitness Instructor',
    specialty: 'fitness',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop&auto=format',
  },
  {
    name: 'Marcus Johnson',
    role: 'Strength Coach',
    specialty: 'fitness',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&auto=format',
  },
  // ---- YOGA ----
  {
    name: 'Alex Rivera',
    role: 'Yoga Instructor',
    specialty: 'yoga',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop&auto=format',
  },
  {
    name: 'Sofia Park',
    role: 'Pilates Instructor',
    specialty: 'yoga',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop&auto=format',
  },
  // ---- CARDIO ----
  {
    name: 'Jordan Lee',
    role: 'HIIT Coach',
    specialty: 'cardio',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop&auto=format',
  },
  {
    name: 'Emma Wu',
    role: 'Running Coach',
    specialty: 'cardio',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop&auto=format',
  },
  // ---- MINDFULNESS ----
  {
    name: 'Ryan Patel',
    role: 'Mindfulness Coach',
    specialty: 'mindfulness',
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=200&h=200&fit=crop&auto=format',
  },
  {
    name: 'Kirra Michel',
    role: 'Meditation Instructor',
    specialty: 'mindfulness',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop&auto=format',
  },
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthflow')
  .then(async () => {
    console.log('Connected to DB -> Seeding Instructors...');
    await Instructor.deleteMany({});
    const inserted = await Instructor.insertMany(instructors);
    console.log(`Seeded ${inserted.length} Instructors successfully.`);
    inserted.forEach(i => console.log(`  [${i.specialty}] ${i.name} -> ${i._id}`));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
