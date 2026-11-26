import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Course from '@/models/Course';
import { seedCourses } from '@/lib/seed';
export async function GET() {
  try { await connectDB(); await seedCourses(); const courses = await Course.find().sort({ createdAt: 1 }); return NextResponse.json({ courses }); }
  catch (error) { console.error('Courses API:', error); return NextResponse.json({ error: 'Unable to load courses.' }, { status: 500 }); }
}
