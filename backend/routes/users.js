const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/users - Admin: get all users with filters
router.get('/', protect, authorize('admin', 'coordinator'), async (req, res) => {
  try {
    const { role, department, isActive } = req.query;
    const query = {};
    if (role) query.role = role;
    if (department) query.department = department;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    const users = await User.find(query).select('-password').sort('-createdAt');
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/users - Admin: create user
router.post('/', protect, authorize('admin', 'coordinator'), async (req, res) => {
  try {
    const { name, email, password, role, department, rollNumber, semester, batch } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });
    const user = await User.create({ name, email, password: password || 'password123', role, department, rollNumber, semester, batch });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/users/:id - Admin: update user
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/users/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'User deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/users/faculty - Get all faculty (for dropdowns)
router.get('/faculty-list', protect, async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty', isActive: true }).select('name email department');
    res.json({ success: true, data: faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
