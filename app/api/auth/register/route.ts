import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { hashPassword, createSession, sessionCookie } from '@/lib/auth';
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json() as { name?: string; email?: string; password?: string };
    if (!name?.trim() || !email?.trim() || !password) return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    await connectDB();
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashPassword(password) });
    const response = NextResponse.json({ message: 'Account created successfully.', user: { id: user._id, name: user.name, email: user.email } }, { status: 201 });
    response.cookies.set(sessionCookie(createSession(user)));
    return response;
  } catch (error) { console.error('Register API:', error); return NextResponse.json({ error: 'Unable to register. Please try again.' }, { status: 500 }); }
}
