const { execSync } = require('child_process');

console.log('--- Starting Full Database Seed ---');

const scripts = [
  'seedUsers.js',
  'seedInstructors.js',
  'seedCoachClasses.js',
  'seedBrands.js',
  'seedFoods.js',
  'seedExercises.js'
];

for (const script of scripts) {
  try {
    console.log(`\n=> Running \${script}...`);
    execSync(`node \${script}`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Error running \${script}:`, err.message);
    process.exit(1);
  }
}

console.log('\n--- Full Database Seed Completed successfully! ---');
