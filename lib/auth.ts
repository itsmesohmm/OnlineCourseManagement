import crypto from 'crypto';
import type { Types } from 'mongoose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'course_portal_session';
const SECRET = process.env.JWT_SECRET || 'development-secret-change-before-deploy';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  exp: number;
}

type SessionIdentity = {
  _id: string | Types.ObjectId;
  name: string;
  email: string;
};

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string | undefined): boolean {
  const [salt, hash] = (stored || '').split(':');
  if (!salt || !hash || hash.length !== 128) return false;
  const test = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(test, 'hex'));
}

function sign(value: string): string {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex');
}

export function createSession(user: SessionIdentity): string {
  const payload = Buffer.from(JSON.stringify({
    id: String(user._id),
    name: user.name,
    email: user.email,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token: string | undefined): SessionUser | null {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  try {
    const user = JSON.parse(Buffer.from(payload, 'base64url').toString()) as SessionUser;
    if (user.exp < Date.now()) return null;
    return user;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(COOKIE_NAME)?.value);
}

export function sessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}
