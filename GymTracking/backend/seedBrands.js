require('dotenv').config();
const mongoose = require('mongoose');
const Brand = require('./src/models/Brand');

const brands = [
  { name: 'Apple Watch', icon: 'bi bi-apple' },
  { name: 'Garmin', icon: 'bi bi-smartwatch' },
  { name: 'Fitbit', icon: 'bi bi-activity' },
  { name: 'Whoop', icon: 'bi bi-bandaid' }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthflow')
  .then(async () => {
    console.log('Connected to DB -> Seeding Brands...');
    await Brand.deleteMany({});
    await Brand.insertMany(brands);
    console.log('Seeded Brands successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
