import mongoose from 'mongoose';
const EnrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedModules: [{ type: mongoose.Schema.Types.ObjectId }],
  enrolledAt: { type: Date, default: Date.now }
}, { timestamps: true });
EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
export default mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
