require('dotenv').config();
const mongoose = require('mongoose');
const CoachClass = require('./src/models/CoachClass');
const Instructor = require('./src/models/Instructor');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthflow')
  .then(async () => {
    console.log('Connected to DB -> Seeding Coach Classes...');

    // Fetch instructors to get their real _id values
    const instructors = await Instructor.find();
    if (instructors.length === 0) {
      console.error('No instructors found! Please run seedInstructors.js first.');
      process.exit(1);
    }

    // Build a map: name -> _id
    const idMap = {};
    instructors.forEach(i => { idMap[i.name] = i._id; });
    console.log('Instructor IDs loaded:', Object.keys(idMap).join(', '));

    const classes = [
      // ========== DENISE CARDENAS – Fitness ==========
      {
        title: 'Full Body Strength Blast',
        duration: '45 min',
        type: 'Workout',
        category: 'strength',
        section: 'Fitness',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Denise Cardenas'],
      },
      {
        title: 'Upper Body Power',
        duration: '30 min',
        type: 'Workout',
        category: 'strength',
        section: 'Fitness',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Denise Cardenas'],
      },
      {
        title: 'Lower Body Strength',
        duration: '35 min',
        type: 'Workout',
        category: 'strength',
        section: 'Fitness',
        image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Denise Cardenas'],
      },
      {
        title: 'Core & Abs Shredder',
        duration: '20 min',
        type: 'Workout',
        category: 'strength',
        section: 'Fitness',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Denise Cardenas'],
      },

      // ========== MARCUS JOHNSON – Fitness ==========
      {
        title: 'Barbell Hypertrophy',
        duration: '50 min',
        type: 'Workout',
        category: 'strength',
        section: 'Fitness',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Marcus Johnson'],
      },
      {
        title: 'Push Pull Legs',
        duration: '60 min',
        type: 'Workout',
        category: 'strength',
        section: 'Fitness',
        image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Marcus Johnson'],
      },
      {
        title: 'Deadlift Masterclass',
        duration: '40 min',
        type: 'Workout',
        category: 'strength',
        section: 'Fitness',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Marcus Johnson'],
      },
      {
        title: 'Functional Strength',
        duration: '35 min',
        type: 'Workout',
        category: 'strength',
        section: 'Fitness',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Marcus Johnson'],
      },

      // ========== ALEX RIVERA – Yoga ==========
      {
        title: 'Morning Sun Salutation',
        duration: '20 min',
        type: 'Yoga',
        category: 'yoga',
        section: 'Stress',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Alex Rivera'],
      },
      {
        title: 'Deep Stretch Flow',
        duration: '30 min',
        type: 'Yoga',
        category: 'mobility',
        section: 'Stress',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Alex Rivera'],
      },
      {
        title: 'Balance & Flexibility',
        duration: '25 min',
        type: 'Yoga',
        category: 'yoga',
        section: 'Stress',
        image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Alex Rivera'],
      },
      {
        title: 'Evening Wind Down Yoga',
        duration: '20 min',
        type: 'Yoga',
        category: 'yoga',
        section: 'Sleep',
        image: 'https://images.unsplash.com/photo-1562088287-bde35a1ea917?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Alex Rivera'],
      },

      // ========== SOFIA PARK – Yoga/Pilates ==========
      {
        title: 'Core Pilates Flow',
        duration: '35 min',
        type: 'Yoga',
        category: 'mobility',
        section: 'Fitness',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Sofia Park'],
      },
      {
        title: 'Mat Pilates Basics',
        duration: '25 min',
        type: 'Yoga',
        category: 'mobility',
        section: 'Fitness',
        image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Sofia Park'],
      },
      {
        title: 'Yoga for Posture',
        duration: '30 min',
        type: 'Yoga',
        category: 'yoga',
        section: 'Stress',
        image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Sofia Park'],
      },
      {
        title: 'Hips & Spine Release',
        duration: '20 min',
        type: 'Yoga',
        category: 'mobility',
        section: 'Stress',
        image: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Sofia Park'],
      },

      // ========== JORDAN LEE – Cardio ==========
      {
        title: 'Full Body HIIT Burn',
        duration: '30 min',
        type: 'Workout',
        category: 'cardio',
        section: 'Peloton',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Jordan Lee'],
      },
      {
        title: 'Tabata Cardio Blast',
        duration: '20 min',
        type: 'Workout',
        category: 'cardio',
        section: 'Peloton',
        image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Jordan Lee'],
      },
      {
        title: 'Jump Rope HIIT',
        duration: '25 min',
        type: 'Workout',
        category: 'cardio',
        section: 'Peloton',
        image: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Jordan Lee'],
      },
      {
        title: 'Kickboxing Cardio',
        duration: '35 min',
        type: 'Workout',
        category: 'cardio',
        section: 'Fitness',
        image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Jordan Lee'],
      },

      // ========== EMMA WU – Cardio/Running ==========
      {
        title: 'Beginner 5K Training',
        duration: '40 min',
        type: 'Workout',
        category: 'running',
        section: 'Peloton',
        image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Emma Wu'],
      },
      {
        title: 'Interval Sprint Session',
        duration: '30 min',
        type: 'Workout',
        category: 'cardio',
        section: 'Peloton',
        image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Emma Wu'],
      },
      {
        title: 'Endurance Run',
        duration: '45 min',
        type: 'Workout',
        category: 'running',
        section: 'Peloton',
        image: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Emma Wu'],
      },
      {
        title: 'Treadmill Fat Burn',
        duration: '35 min',
        type: 'Workout',
        category: 'cardio',
        section: 'Fitness',
        image: 'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Emma Wu'],
      },

      // ========== RYAN PATEL – Mindfulness ==========
      {
        title: 'Morning Mindfulness',
        duration: '10 min',
        type: 'Mindfulness',
        category: 'mindful',
        section: 'Stress',
        image: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Ryan Patel'],
      },
      {
        title: 'Stress Relief Breathing',
        duration: '15 min',
        type: 'Mindfulness',
        category: 'mindful',
        section: 'Stress',
        image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Ryan Patel'],
      },
      {
        title: 'Body Scan Meditation',
        duration: '20 min',
        type: 'Mindfulness',
        category: 'mindful',
        section: 'Sleep',
        image: 'https://images.unsplash.com/photo-1470116892389-0de5d9770b2c?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Ryan Patel'],
      },
      {
        title: 'Focus & Clarity Session',
        duration: '12 min',
        type: 'Mindfulness',
        category: 'mindful',
        section: 'Stress',
        image: 'https://images.unsplash.com/photo-1573822463545-cccca61bbd48?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Ryan Patel'],
      },

      // ========== KIRRA MICHEL – Mindfulness/Meditation ==========
      {
        title: 'Evening Sleep Meditation',
        duration: '15 min',
        type: 'Mindfulness',
        category: 'mindful',
        section: 'Sleep',
        image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Kirra Michel'],
      },
      {
        title: 'Guided Relaxation',
        duration: '10 min',
        type: 'Mindfulness',
        category: 'mindful',
        section: 'Sleep',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Kirra Michel'],
      },
      {
        title: 'Gratitude & Journaling',
        duration: '8 min',
        type: 'Mindfulness',
        category: 'mindful',
        section: 'Stress',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Kirra Michel'],
      },
      {
        title: 'Mobility & Recovery Flow',
        duration: '18 min',
        type: 'Mindfulness',
        category: 'mobility',
        section: 'Sleep',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructorId: idMap['Kirra Michel'],
      },
    ];

    await CoachClass.deleteMany({});
    const inserted = await CoachClass.insertMany(classes);
    console.log(`Seeded ${inserted.length} Coach Classes successfully.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
