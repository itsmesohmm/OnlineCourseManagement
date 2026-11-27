import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { verifyPassword, createSession, sessionCookie } from '@/lib/auth';
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json() as { email?: string; password?: string };
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    await connectDB();
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !verifyPassword(password, user.password)) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    const response = NextResponse.json({ message: 'Login successful.', user: { id: user._id, name: user.name, email: user.email } });
    response.cookies.set(sessionCookie(createSession(user)));
    return response;
  } catch (error) { console.error('Login API:', error); return NextResponse.json({ error: 'Unable to login. Please try again.' }, { status: 500 }); }
}
