require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('./src/models/Exercise');

const exercises = [
  // Ngực
  { name: 'Đẩy ngực ngang ghế phẳng (Barbell Bench Press)', muscleGroup: 'Ngực', defaultSets: 4, defaultRepsMin: 8, defaultRepsMax: 12, imageUrl: 'https://fitbod.me/wp-content/uploads/2021/07/barbell-bench-press.jpg' },
  { name: 'Đẩy ngực dốc lên (Incline Dumbbell Press)', muscleGroup: 'Ngực', defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 15, imageUrl: 'https://barbend.com/wp-content/uploads/2023/12/incline-barbell-bench-press-1024x768.jpg' },
  { name: 'Ép ngực cáp (Cable Crossover)', muscleGroup: 'Ngực', defaultSets: 3, defaultRepsMin: 12, defaultRepsMax: 15, imageUrl: 'https://cdn.muscleandstrength.com/sites/default/files/cable-crossover-1.jpg' },
  { name: 'Hít đất (Push Ups)', muscleGroup: 'Ngực', defaultSets: 3, defaultRepsMin: 15, defaultRepsMax: 20, imageUrl: 'https://cdn.shopify.com/s/files/1/1876/4703/articles/shutterstock_1648008892_1000x.jpg' },
  // Lưng
  { name: 'Kéo xà đơn (Pull Ups)', muscleGroup: 'Lưng', defaultSets: 4, defaultRepsMin: 6, defaultRepsMax: 10, imageUrl: 'https://images.squarespace-cdn.com/content/v1/59df95bdf9a61e6bd74542ee/1559869686036-Z8QZQZ80Z8QZQZ80Z8QZ/pull+up+anatomy.jpg' },
  { name: 'Kéo cáp xô (Lat Pulldown)', muscleGroup: 'Lưng', defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 15, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif' },
  { name: 'Chèo thuyền tạ đòn (Barbell Row)', muscleGroup: 'Lưng', defaultSets: 4, defaultRepsMin: 8, defaultRepsMax: 12, imageUrl: 'https://stronglifts.com/wp-content/uploads/barbell-row.jpg' },
  { name: 'Ngồi chèo cáp (Seated Cable Row)', muscleGroup: 'Lưng', defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/seated-cable-row-1-1582298642.jpg' },
  // Vai
  { name: 'Đẩy vai tạ đơn (Dumbbell Shoulder Press)', muscleGroup: 'Vai', defaultSets: 4, defaultRepsMin: 8, defaultRepsMax: 12, imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/dumbbell-shoulder-press-1-1582298642.jpg' },
  { name: 'Dang tay tạ đơn (Lateral Raise)', muscleGroup: 'Vai', defaultSets: 4, defaultRepsMin: 12, defaultRepsMax: 15, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif' },
  { name: 'Kéo cáp vai sau (Face Pull)', muscleGroup: 'Vai', defaultSets: 3, defaultRepsMin: 12, defaultRepsMax: 15, imageUrl: 'https://builtwithscience.com/wp-content/uploads/2019/12/face-pull-2.jpg' },
  // Chân
  { name: 'Gánh tạ (Barbell Squat)', muscleGroup: 'Chân', defaultSets: 4, defaultRepsMin: 6, defaultRepsMax: 10, imageUrl: 'https://stronglifts.com/wp-content/uploads/squat.jpg' },
  { name: 'Đạp đùi (Leg Press)', muscleGroup: 'Chân', defaultSets: 4, defaultRepsMin: 10, defaultRepsMax: 15, imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/leg-press-1-1582298642.jpg' },
  { name: 'Móc đùi sau (Leg Curl)', muscleGroup: 'Chân', defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 15, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Curl.gif' },
  { name: 'Đá đùi trước (Leg Extension)', muscleGroup: 'Chân', defaultSets: 3, defaultRepsMin: 12, defaultRepsMax: 15, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Extension.gif' },
  { name: 'Nhón gót (Calf Raise)', muscleGroup: 'Chân', defaultSets: 4, defaultRepsMin: 15, defaultRepsMax: 20, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Calf-Raise.gif' },
  // Tay
  { name: 'Cuốn tạ đòn (Barbell Curl)', muscleGroup: 'Tay', defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/barbell-curl-1-1582298642.jpg' },
  { name: 'Cuốn tạ đơn (Dumbbell Curl)', muscleGroup: 'Tay', defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif' },
  { name: 'Nhấn cáp tay sau (Tricep Pushdown)', muscleGroup: 'Tay', defaultSets: 3, defaultRepsMin: 12, defaultRepsMax: 15, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Tricep-Pushdown.gif' },
  { name: 'Vớt tạ dốc lên (Skull Crusher)', muscleGroup: 'Tay', defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Skull-Crusher.gif' },
  // Bụng
  { name: 'Gập bụng (Crunches)', muscleGroup: 'Bụng', defaultSets: 3, defaultRepsMin: 15, defaultRepsMax: 20, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif' },
  { name: 'Nâng chân (Hanging Leg Raise)', muscleGroup: 'Bụng', defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 15, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Leg-Raise.gif' },
  { name: 'Plank', muscleGroup: 'Bụng', defaultSets: 3, defaultRepsMin: 60, defaultRepsMax: 120, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif' },
  // Toàn thân / Tim mạch
  { name: 'Chạy bộ (Treadmill)', muscleGroup: 'Tim mạch', type: 'Cardio', defaultSets: 1, defaultRepsMin: 15, defaultRepsMax: 30, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/09/Treadmill.gif' },
  { name: 'Đạp xe (Cycling)', muscleGroup: 'Tim mạch', type: 'Cardio', defaultSets: 1, defaultRepsMin: 20, defaultRepsMax: 45, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/09/Stationary-Bike.gif' },
  { name: 'Burpees', muscleGroup: 'Toàn thân', type: 'Cardio', defaultSets: 3, defaultRepsMin: 15, defaultRepsMax: 20, imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Burpee.gif' }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthflow')
  .then(async () => {
    console.log('Connected to DB');
    await Exercise.deleteMany({});
    
    // Inject dynamic cal metrics based on cardio vs weight
    const seededExercises = exercises.map(ex => ({
      ...ex,
      caloriesPerSet: ex.type === 'Cardio' ? 50 : Math.floor(Math.random() * 8) + 12
    }));

    await Exercise.insertMany(seededExercises);
    console.log('Seeded Exercises successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
