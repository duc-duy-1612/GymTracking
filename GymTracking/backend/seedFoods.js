require('dotenv').config();
const mongoose = require('mongoose');
const FoodItem = require('./src/models/FoodItem');

const foods = [
  { name: 'Cơm trắng', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, glucose: 0.1, category: 'Tinh bột' },
  { name: 'Ức gà luộc', calories: 165, protein: 31, carbs: 0, fat: 3.6, glucose: 0, category: 'Protein' },
  { name: 'Táo', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, glucose: 10, category: 'Hoa quả', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6' },
  { name: 'Trứng luộc', calories: 78, protein: 6, carbs: 0.6, fat: 5, glucose: 0.6, category: 'Protein' },
  { name: 'Bánh ngọt (Cake)', calories: 350, protein: 3, carbs: 50, fat: 15, glucose: 30, category: 'Ăn vặt', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' },
  { name: 'Coca Cola', calories: 140, protein: 0, carbs: 39, fat: 0, glucose: 39, category: 'Nước ngọt', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97' },
  { name: 'Sữa chua', calories: 100, protein: 10, carbs: 15, fat: 0, glucose: 14, category: 'Snack', image: 'https://images.unsplash.com/photo-1549880181-56a44cf4a9a5' },
  { name: 'Bò bít tết', calories: 250, protein: 26, carbs: 0, fat: 15, glucose: 0, category: 'Protein', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e' },
  { name: 'Bánh mì ngọt', calories: 280, protein: 6, carbs: 45, fat: 8, glucose: 15, category: 'Ăn vặt', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff' },
  { name: 'Hạt điều', calories: 553, protein: 18, carbs: 30, fat: 44, glucose: 5, category: 'Hạt', image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a' }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthflow')
  .then(async () => {
    console.log('Connected to DB');
    await FoodItem.deleteMany({});
    await FoodItem.insertMany(foods);
    console.log('Seeded Food items with Glucose metrics successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
