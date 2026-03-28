const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  credits: { type: Number, default: 3 },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
