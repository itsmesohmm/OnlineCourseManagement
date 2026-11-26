import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
    const { id } = await params; if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid enrollment ID.' }, { status: 400 });
    const { moduleId, completed } = await request.json(); if (!moduleId || typeof completed !== 'boolean') return NextResponse.json({ error: 'moduleId and completed are required.' }, { status: 400 });
    await connectDB(); const enrollment = await Enrollment.findOne({ _id: id, studentId: user.id }).populate('courseId'); if (!enrollment) return NextResponse.json({ error: 'Enrollment not found.' }, { status: 404 });
    const validModule = enrollment.courseId.modules.some((module) => String(module._id) === String(moduleId)); if (!validModule) return NextResponse.json({ error: 'Module does not belong to this course.' }, { status: 400 });
    const already = enrollment.completedModules.some((m) => String(m) === String(moduleId));
    if (completed && !already) enrollment.completedModules.push(moduleId);
    if (!completed && already) enrollment.completedModules = enrollment.completedModules.filter((m) => String(m) !== String(moduleId));
    await enrollment.save(); const total = enrollment.courseId.modules.length; const progress = total ? Math.round((enrollment.completedModules.length / total) * 100) : 0;
    return NextResponse.json({ message: 'Progress updated.', progress, enrollment });
  } catch (error) { console.error('Progress API:', error); return NextResponse.json({ error: 'Unable to update progress.' }, { status: 500 }); }
}
