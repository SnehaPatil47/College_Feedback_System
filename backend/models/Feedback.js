const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ratings: {
    teachingQuality: { type: Number, min: 1, max: 5, required: true },
    courseContent: { type: Number, min: 1, max: 5, required: true },
    accessibility: { type: Number, min: 1, max: 5, required: true },
    communication: { type: Number, min: 1, max: 5, required: true },
    overallSatisfaction: { type: Number, min: 1, max: 5, required: true }
  },
  comment: { type: String, maxlength: 1000 },
  isAnonymous: { type: Boolean, default: false },
  semester: { type: Number, required: true },
  batch: { type: String, required: true },
  status: { type: String, enum: ['pending', 'reviewed', 'actioned'], default: 'pending' },
  averageRating: { type: Number }
}, { timestamps: true });

feedbackSchema.pre('save', function (next) {
  const r = this.ratings;
  this.averageRating = ((r.teachingQuality + r.courseContent + r.accessibility + r.communication + r.overallSatisfaction) / 5).toFixed(2);
  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);
