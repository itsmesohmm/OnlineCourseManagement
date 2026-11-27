import mongoose, { Types } from 'mongoose';

export interface CourseModuleRecord {
  _id?: Types.ObjectId;
  title: string;
  description: string;
}

export interface CourseRecord {
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  duration: string;
  accent: string;
  modules: CourseModuleRecord[];
}

const ModuleSchema = new mongoose.Schema<CourseModuleRecord>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
}, { _id: true });

const CourseSchema = new mongoose.Schema<CourseRecord>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, default: 'Beginner' },
  duration: { type: String, default: '4 weeks' },
  accent: { type: String, default: '#2563eb' },
  modules: [ModuleSchema],
}, { timestamps: true });

const CourseModel = mongoose.models.Course as mongoose.Model<CourseRecord> | undefined
  ?? mongoose.model<CourseRecord>('Course', CourseSchema);

export default CourseModel;
