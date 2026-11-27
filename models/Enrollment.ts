import mongoose, { Types } from 'mongoose';

export interface EnrollmentRecord {
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  completedModules: Types.ObjectId[];
  enrolledAt?: Date;
}

const EnrollmentSchema = new mongoose.Schema<EnrollmentRecord>({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedModules: [{ type: mongoose.Schema.Types.ObjectId }],
  enrolledAt: { type: Date, default: Date.now },
}, { timestamps: true });

EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const EnrollmentModel = mongoose.models.Enrollment as mongoose.Model<EnrollmentRecord> | undefined
  ?? mongoose.model<EnrollmentRecord>('Enrollment', EnrollmentSchema);

export default EnrollmentModel;
