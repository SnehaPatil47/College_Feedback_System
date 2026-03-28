const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

// @POST /api/feedback - Submit feedback (student)
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { courseId, ratings, comment, isAnonymous } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const existing = await Feedback.findOne({ student: req.user.id, course: courseId, semester: req.user.semester });
    if (existing) return res.status(400).json({ success: false, message: 'You already submitted feedback for this course this semester' });
    const feedback = await Feedback.create({
      student: req.user.id,
      course: courseId,
      faculty: course.faculty,
      ratings,
      comment,
      isAnonymous: isAnonymous || false,
      semester: req.user.semester,
      batch: req.user.batch
    });
    await feedback.populate('course', 'name code');
    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/feedback/my - Student: get own submitted feedbacks
router.get('/my', protect, authorize('student'), async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ student: req.user.id })
      .populate('course', 'name code')
      .populate('faculty', 'name')
      .sort('-createdAt');
    res.json({ success: true, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/feedback/faculty - Faculty: get feedback for their courses
router.get('/faculty', protect, authorize('faculty'), async (req, res) => {
  try {
    const { courseId, batch, semester } = req.query;
    const query = { faculty: req.user.id };
    if (courseId) query.course = courseId;
    if (batch) query.batch = batch;
    if (semester) query.semester = Number(semester);
    const feedbacks = await Feedback.find(query)
      .populate('course', 'name code')
      .populate({ path: 'student', select: 'name rollNumber', match: { _id: { $exists: true } } })
      .sort('-createdAt');
    const filtered = feedbacks.map(f => ({
      ...f.toObject(),
      student: f.isAnonymous ? { name: 'Anonymous' } : f.student
    }));
    res.json({ success: true, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/feedback/all - Admin/Coordinator: all feedbacks
router.get('/all', protect, authorize('admin', 'coordinator'), async (req, res) => {
  try {
    const { courseId, facultyId, batch, semester, status } = req.query;
    const query = {};
    if (courseId) query.course = courseId;
    if (facultyId) query.faculty = facultyId;
    if (batch) query.batch = batch;
    if (semester) query.semester = Number(semester);
    if (status) query.status = status;
    const feedbacks = await Feedback.find(query)
      .populate('course', 'name code department')
      .populate('faculty', 'name department')
      .populate('student', 'name rollNumber')
      .sort('-createdAt');
    res.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/feedback/analytics - aggregated analytics
router.get('/analytics', protect, authorize('admin', 'coordinator', 'faculty'), async (req, res) => {
  try {
    const matchStage = {};
    if (req.user.role === 'faculty') matchStage.faculty = req.user._id;
    const analytics = await Feedback.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$course',
          avgTeaching: { $avg: '$ratings.teachingQuality' },
          avgContent: { $avg: '$ratings.courseContent' },
          avgAccessibility: { $avg: '$ratings.accessibility' },
          avgCommunication: { $avg: '$ratings.communication' },
          avgOverall: { $avg: '$ratings.overallSatisfaction' },
          totalFeedbacks: { $sum: 1 }
        }
      },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $sort: { avgOverall: -1 } }
    ]);
    const monthlyTrend = await Feedback.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          avgRating: { $avg: '$averageRating' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    res.json({ success: true, analytics, monthlyTrend });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/feedback/:id/status
router.put('/:id/status', protect, authorize('admin', 'coordinator'), async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
