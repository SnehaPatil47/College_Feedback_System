const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/courses
router.get('/', protect, async (req, res) => {
  try {
    const { department, semester, facultyId } = req.query;
    const query = { isActive: true };
    if (department) query.department = department;
    if (semester) query.semester = Number(semester);
    if (facultyId) query.faculty = facultyId;
    if (req.user.role === 'student') { query.semester = req.user.semester; }
    if (req.user.role === 'faculty') { query.faculty = req.user._id; }
    const courses = await Course.find(query).populate('faculty', 'name email department');
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/courses
router.post('/', protect, authorize('admin', 'coordinator'), async (req, res) => {
  try {
    const course = await Course.create(req.body);
    await course.populate('faculty', 'name email');
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/courses/:id
router.put('/:id', protect, authorize('admin', 'coordinator'), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('faculty', 'name');
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/courses/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Course deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
