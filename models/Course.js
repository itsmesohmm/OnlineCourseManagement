import mongoose from 'mongoose';
const ModuleSchema = new mongoose.Schema({ title: { type: String, required: true }, description: { type: String, default: '' } }, { _id: true });
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true }, description: { type: String, required: true }, instructor: { type: String, required: true },
  category: { type: String, required: true }, level: { type: String, default: 'Beginner' }, duration: { type: String, default: '4 weeks' },
  accent: { type: String, default: '#2563eb' }, modules: [ModuleSchema]
}, { timestamps: true });
export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
