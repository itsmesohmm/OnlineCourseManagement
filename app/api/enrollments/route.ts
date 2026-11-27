import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import { seedCourses } from '@/lib/seed';
export async function GET() {
  try { const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: 'Please log in.' }, { status: 401 }); await connectDB(); await seedCourses(); const enrollments = await Enrollment.find({ studentId: user.id }).populate('courseId').sort({ enrolledAt: -1 }); return NextResponse.json({ enrollments }); }
  catch (error) { console.error('Enrollments GET:', error); return NextResponse.json({ error: 'Unable to load enrollments.' }, { status: 500 }); }
}
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Please log in to enroll.' }, { status: 401 });
    const { courseId } = await request.json() as { courseId?: string };
    if (!courseId) return NextResponse.json({ error: 'Course ID is required.' }, { status: 400 });
    await connectDB();
    await seedCourses();
    const course = await Course.findById(courseId);
    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    const existing = await Enrollment.findOne({ studentId: user.id, courseId });
    if (existing) return NextResponse.json({ error: 'You are already enrolled in this course.' }, { status: 409 });
    const enrollment = await Enrollment.create({ studentId: user.id, courseId, completedModules: [] });
    return NextResponse.json({ message: 'Successfully enrolled.', enrollment }, { status: 201 });
  } catch (error: unknown) {
    console.error('Enrollments POST:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      return NextResponse.json({ error: 'You are already enrolled.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Unable to enroll.' }, { status: 500 });
  }
}
