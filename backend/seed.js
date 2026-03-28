const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Feedback = require('./models/Feedback');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  await User.deleteMany({});
  await Course.deleteMany({});
  await Feedback.deleteMany({});

  // Use User.create() one-by-one so the pre-save hash hook fires correctly
  const admin = await User.create({ name: 'Admin User', email: 'admin@college.edu', password: 'password123', role: 'admin', department: 'Administration' });
  const coordinator = await User.create({ name: 'Dr. Coordinator', email: 'coordinator@college.edu', password: 'password123', role: 'coordinator', department: 'CSE' });

  const f1 = await User.create({ name: 'Dr. Priya Sharma', email: 'priya@college.edu', password: 'password123', role: 'faculty', department: 'CSE' });
  const f2 = await User.create({ name: 'Prof. Rajesh Kumar', email: 'rajesh@college.edu', password: 'password123', role: 'faculty', department: 'Mathematics' });
  const f3 = await User.create({ name: 'Dr. Anita Verma', email: 'anita@college.edu', password: 'password123', role: 'faculty', department: 'Physics' });
  const f4 = await User.create({ name: 'Prof. Suresh Nair', email: 'suresh@college.edu', password: 'password123', role: 'faculty', department: 'CSE' });
  const faculties = [f1, f2, f3, f4];

  const s1 = await User.create({ name: 'Arjun Patel', email: 'arjun@student.college.edu', password: 'password123', role: 'student', department: 'CSE', rollNumber: 'CSE2021001', semester: 5, batch: '2021' });
  const s2 = await User.create({ name: 'Sneha Reddy', email: 'sneha@student.college.edu', password: 'password123', role: 'student', department: 'CSE', rollNumber: 'CSE2021002', semester: 5, batch: '2021' });
  const s3 = await User.create({ name: 'Vikram Singh', email: 'vikram@student.college.edu', password: 'password123', role: 'student', department: 'CSE', rollNumber: 'CSE2021003', semester: 5, batch: '2021' });
  const students = [s1, s2, s3];

  const courses = await Course.insertMany([
    { name: 'Data Structures & Algorithms', code: 'CSE301', department: 'CSE', semester: 5, faculty: f1._id, credits: 4 },
    { name: 'Database Management Systems', code: 'CSE302', department: 'CSE', semester: 5, faculty: f4._id, credits: 4 },
    { name: 'Engineering Mathematics', code: 'MATH301', department: 'Mathematics', semester: 5, faculty: f2._id, credits: 3 },
    { name: 'Applied Physics', code: 'PHY301', department: 'Physics', semester: 5, faculty: f3._id, credits: 3 },
    { name: 'Operating Systems', code: 'CSE303', department: 'CSE', semester: 5, faculty: f1._id, credits: 4 },
  ]);

  for (const student of students) {
    for (let i = 0; i < 3; i++) {
      const course = courses[i];
      await Feedback.create({
        student: student._id,
        course: course._id,
        faculty: course.faculty,
        ratings: {
          teachingQuality: Math.ceil(Math.random() * 2) + 3,
          courseContent: Math.ceil(Math.random() * 2) + 3,
          accessibility: Math.ceil(Math.random() * 2) + 2,
          communication: Math.ceil(Math.random() * 2) + 3,
          overallSatisfaction: Math.ceil(Math.random() * 2) + 3,
        },
        comment: ['Great teaching style!', 'Could improve interaction.', 'Very knowledgeable professor.'][i % 3],
        isAnonymous: i % 2 === 0,
        semester: student.semester,
        batch: student.batch
      });
    }
  }

  console.log('✅ Seed completed!');
  console.log('\nDemo Accounts:');
  console.log('Admin:       admin@college.edu / password123');
  console.log('Coordinator: coordinator@college.edu / password123');
  console.log('Faculty:     priya@college.edu / password123');
  console.log('Student:     arjun@student.college.edu / password123');
  process.exit();
}

seed().catch(err => { console.error(err); process.exit(1); });