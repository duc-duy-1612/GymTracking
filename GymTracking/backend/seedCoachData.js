require('dotenv').config();
const mongoose = require('mongoose');
const Instructor = require('./src/models/Instructor');
const CoachClass = require('./src/models/CoachClass');

const instructorData = [
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

const buildClasses = (idMap) => [
  // ========== DENISE CARDENAS – Fitness (5 lớp) ==========
  {
    title: 'Full Body Strength Blast',
    duration: '45 min', type: 'Workout', category: 'strength', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Denise Cardenas'],
  },
  {
    title: 'Upper Body Power',
    duration: '30 min', type: 'Workout', category: 'strength', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Denise Cardenas'],
  },
  {
    title: 'Lower Body Strength',
    duration: '35 min', type: 'Workout', category: 'strength', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Denise Cardenas'],
  },
  {
    title: 'Core & Abs Shredder',
    duration: '20 min', type: 'Workout', category: 'strength', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1516408963804-2d2b44d10a01?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Denise Cardenas'],
  },
  {
    title: 'Glute & Leg Burn',
    duration: '40 min', type: 'Workout', category: 'strength', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Denise Cardenas'],
  },

  // ========== MARCUS JOHNSON – Fitness (5 lớp) ==========
  {
    title: 'Barbell Hypertrophy',
    duration: '50 min', type: 'Workout', category: 'strength', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Marcus Johnson'],
  },
  {
    title: 'Push Pull Legs',
    duration: '60 min', type: 'Workout', category: 'strength', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Marcus Johnson'],
  },
  {
    title: 'Deadlift Masterclass',
    duration: '40 min', type: 'Workout', category: 'strength', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Marcus Johnson'],
  },
  {
    title: 'Functional Strength',
    duration: '35 min', type: 'Workout', category: 'strength', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Marcus Johnson'],
  },
  {
    title: 'Chest & Back Builder',
    duration: '45 min', type: 'Workout', category: 'strength', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Marcus Johnson'],
  },

  // ========== ALEX RIVERA – Yoga (5 lớp) ==========
  {
    title: 'Morning Sun Salutation',
    duration: '20 min', type: 'Yoga', category: 'yoga', section: 'Stress',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Alex Rivera'],
  },
  {
    title: 'Deep Stretch Flow',
    duration: '30 min', type: 'Yoga', category: 'mobility', section: 'Stress',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Alex Rivera'],
  },
  {
    title: 'Balance & Flexibility',
    duration: '25 min', type: 'Yoga', category: 'yoga', section: 'Stress',
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Alex Rivera'],
  },
  {
    title: 'Evening Wind Down Yoga',
    duration: '20 min', type: 'Yoga', category: 'yoga', section: 'Sleep',
    image: 'https://images.unsplash.com/photo-1562088287-bde35a1ea917?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Alex Rivera'],
  },
  {
    title: 'Yoga for Stress Relief',
    duration: '35 min', type: 'Yoga', category: 'yoga', section: 'Stress',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Alex Rivera'],
  },

  // ========== SOFIA PARK – Yoga/Pilates (5 lớp) ==========
  {
    title: 'Core Pilates Flow',
    duration: '35 min', type: 'Yoga', category: 'mobility', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Sofia Park'],
  },
  {
    title: 'Mat Pilates Basics',
    duration: '25 min', type: 'Yoga', category: 'mobility', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Sofia Park'],
  },
  {
    title: 'Yoga for Posture',
    duration: '30 min', type: 'Yoga', category: 'yoga', section: 'Stress',
    image: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Sofia Park'],
  },
  {
    title: 'Hips & Spine Release',
    duration: '20 min', type: 'Yoga', category: 'mobility', section: 'Stress',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Sofia Park'],
  },
  {
    title: 'Power Pilates Challenge',
    duration: '40 min', type: 'Yoga', category: 'mobility', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Sofia Park'],
  },

  // ========== JORDAN LEE – Cardio (5 lớp) ==========
  {
    title: 'Full Body HIIT Burn',
    duration: '30 min', type: 'Workout', category: 'cardio', section: 'Peloton',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Jordan Lee'],
  },
  {
    title: 'Tabata Cardio Blast',
    duration: '20 min', type: 'Workout', category: 'cardio', section: 'Peloton',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Jordan Lee'],
  },
  {
    title: 'Jump Rope HIIT',
    duration: '25 min', type: 'Workout', category: 'cardio', section: 'Peloton',
    image: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Jordan Lee'],
  },
  {
    title: 'Kickboxing Cardio',
    duration: '35 min', type: 'Workout', category: 'cardio', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Jordan Lee'],
  },
  {
    title: 'Cardio Dance Party',
    duration: '30 min', type: 'Workout', category: 'cardio', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Jordan Lee'],
  },

  // ========== EMMA WU – Cardio/Running (5 lớp) ==========
  {
    title: 'Beginner 5K Training',
    duration: '40 min', type: 'Workout', category: 'running', section: 'Peloton',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Emma Wu'],
  },
  {
    title: 'Interval Sprint Session',
    duration: '30 min', type: 'Workout', category: 'cardio', section: 'Peloton',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Emma Wu'],
  },
  {
    title: 'Endurance Run',
    duration: '45 min', type: 'Workout', category: 'running', section: 'Peloton',
    image: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Emma Wu'],
  },
  {
    title: 'Treadmill Fat Burn',
    duration: '35 min', type: 'Workout', category: 'cardio', section: 'Fitness',
    image: 'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Emma Wu'],
  },
  {
    title: 'Speed & Agility Drills',
    duration: '25 min', type: 'Workout', category: 'running', section: 'Peloton',
    image: 'https://images.unsplash.com/photo-1523904200083-8f66fce8e5d3?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Emma Wu'],
  },

  // ========== RYAN PATEL – Mindfulness (5 lớp) ==========
  {
    title: 'Morning Mindfulness',
    duration: '10 min', type: 'Mindfulness', category: 'mindful', section: 'Stress',
    image: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Ryan Patel'],
  },
  {
    title: 'Stress Relief Breathing',
    duration: '15 min', type: 'Mindfulness', category: 'mindful', section: 'Stress',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Ryan Patel'],
  },
  {
    title: 'Body Scan Meditation',
    duration: '20 min', type: 'Mindfulness', category: 'mindful', section: 'Sleep',
    image: 'https://images.unsplash.com/photo-1470116892389-0de5d9770b2c?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Ryan Patel'],
  },
  {
    title: 'Focus & Clarity Session',
    duration: '12 min', type: 'Mindfulness', category: 'mindful', section: 'Stress',
    image: 'https://images.unsplash.com/photo-1573822463545-cccca61bbd48?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Ryan Patel'],
  },
  {
    title: 'Mindful Movement',
    duration: '18 min', type: 'Mindfulness', category: 'mindful', section: 'Stress',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Ryan Patel'],
  },

  // ========== KIRRA MICHEL – Mindfulness/Meditation (5 lớp) ==========
  {
    title: 'Evening Sleep Meditation',
    duration: '15 min', type: 'Mindfulness', category: 'mindful', section: 'Sleep',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Kirra Michel'],
  },
  {
    title: 'Guided Relaxation',
    duration: '10 min', type: 'Mindfulness', category: 'mindful', section: 'Sleep',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Kirra Michel'],
  },
  {
    title: 'Gratitude & Journaling',
    duration: '8 min', type: 'Mindfulness', category: 'mindful', section: 'Stress',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Kirra Michel'],
  },
  {
    title: 'Mobility & Recovery Flow',
    duration: '18 min', type: 'Mindfulness', category: 'mobility', section: 'Sleep',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Kirra Michel'],
  },
  {
    title: 'Deep Sleep Soundscape',
    duration: '30 min', type: 'Mindfulness', category: 'mindful', section: 'Sleep',
    image: 'https://images.unsplash.com/photo-1488188840666-e2308741a62f?w=400&h=240&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorId: idMap['Kirra Michel'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthflow');
    console.log('✅ Connected to:', mongoose.connection.name);

    // STEP 1: Seed Instructors
    console.log('\n--- Seeding Instructors ---');
    await Instructor.deleteMany({});
    const insertedInstructors = await Instructor.insertMany(instructorData);
    console.log(`✅ Seeded ${insertedInstructors.length} instructors`);

    // Build id map name -> _id
    const idMap = {};
    insertedInstructors.forEach(inst => {
      idMap[inst.name] = inst._id;
      console.log(`  [${inst.specialty}] ${inst.name} -> ${inst._id}`);
    });

    // STEP 2: Seed Coach Classes with correct instructorIds
    console.log('\n--- Seeding Coach Classes ---');
    await CoachClass.deleteMany({});
    const classes = buildClasses(idMap);

    // Validate: check for undefined instructorIds
    const invalid = classes.filter(c => !c.instructorId);
    if (invalid.length > 0) {
      console.error('❌ Found classes with missing instructorId:', invalid.map(c => c.title));
      process.exit(1);
    }

    const insertedClasses = await CoachClass.insertMany(classes);
    console.log(`✅ Seeded ${insertedClasses.length} coach classes`);

    // STEP 3: Verify
    console.log('\n--- Verification ---');
    for (const inst of insertedInstructors) {
      const count = await CoachClass.countDocuments({ instructorId: inst._id });
      console.log(`  ${inst.name}: ${count} class(es)`);
    }

    console.log('\n🎉 All done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
