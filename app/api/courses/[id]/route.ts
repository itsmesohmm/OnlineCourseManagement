import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Course from '@/models/Course';
import { seedCourses } from '@/lib/seed';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const { id } = await params; if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid course ID.' }, { status: 400 }); await connectDB(); await seedCourses(); const course = await Course.findById(id); if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 }); return NextResponse.json({ course }); }
  catch (error) { console.error('Course detail API:', error); return NextResponse.json({ error: 'Unable to load course.' }, { status: 500 }); }
}
