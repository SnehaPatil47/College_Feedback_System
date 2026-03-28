const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Feedback = require('../models/Feedback');
const { protect, authorize } = require('../middleware/auth');

router.get('/overview', protect, authorize('admin', 'coordinator'), async (req, res) => {
  try {
    const [totalStudents, totalFaculty, totalCourses, totalFeedbacks, pendingFeedbacks, avgRatingData] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'faculty', isActive: true }),
      Course.countDocuments({ isActive: true }),
      Feedback.countDocuments(),
      Feedback.countDocuments({ status: 'pending' }),
      Feedback.aggregate([{ $group: { _id: null, avg: { $avg: '$averageRating' } } }])
    ]);
    const avgRating = avgRatingData[0]?.avg?.toFixed(2) || 0;
    const deptStats = await Feedback.aggregate([
      { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'courseData' } },
      { $unwind: '$courseData' },
      { $group: { _id: '$courseData.department', count: { $sum: 1 }, avgRating: { $avg: '$averageRating' } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data: { totalStudents, totalFaculty, totalCourses, totalFeedbacks, pendingFeedbacks, avgRating, deptStats } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
