import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid enrollment ID.' }, { status: 400 });
    const { moduleId, completed } = await request.json() as { moduleId?: string; completed?: boolean };
    if (!moduleId || typeof completed !== 'boolean') return NextResponse.json({ error: 'moduleId and completed are required.' }, { status: 400 });
    await connectDB();
    const enrollment = await Enrollment.findOne({ _id: id, studentId: user.id });
    if (!enrollment) return NextResponse.json({ error: 'Enrollment not found.' }, { status: 404 });
    const course = await Course.findById(enrollment.courseId);
    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    const validModule = course.modules.some((module) => String(module._id) === moduleId);
    if (!validModule) return NextResponse.json({ error: 'Module does not belong to this course.' }, { status: 400 });
    const already = enrollment.completedModules.some((item) => String(item) === moduleId);
    if (completed && !already) enrollment.completedModules.push(new mongoose.Types.ObjectId(moduleId));
    if (!completed && already) enrollment.completedModules = enrollment.completedModules.filter((item) => String(item) !== moduleId);
    await enrollment.save();
    const total = course.modules.length;
    const progress = total ? Math.round((enrollment.completedModules.length / total) * 100) : 0;
    return NextResponse.json({ message: 'Progress updated.', progress, enrollment });
  } catch (error: unknown) {
    console.error('Progress API:', error);
    return NextResponse.json({ error: 'Unable to update progress.' }, { status: 500 });
  }
}
