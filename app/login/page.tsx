'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { readJsonResponse } from '@/lib/http';
import type { MessageResponse } from '@/lib/types';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await readJsonResponse<MessageResponse>(response);
      if (!response.ok) throw new Error(data.error || 'Login failed.');
      window.location.href = '/dashboard';
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-aside">
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Pick up where<br />you left off.</h1>
        <p>Your courses and progress are waiting for you.</p>
        <div className="auth-aside-bottom">LearnSpace · Learn at your own pace</div>
      </div>
      <div className="auth-form-wrap">
        <form className="form-card" onSubmit={submit}>
          <span className="eyebrow">STUDENT PORTAL</span>
          <h2>Log in</h2>
          <p className="form-intro">Enter your credentials to access your dashboard.</p>
          {error && <div role="alert" className="alert error">{error}</div>}
          <label>Email address<input type="email" required autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>
          <label>Password<input type="password" required autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Your password" /></label>
          <button className="button primary full" disabled={loading}>{loading ? 'Signing in…' : 'Log in'}</button>
          <p className="form-bottom">New to LearnSpace? <Link href="/register">Create account</Link></p>
        </form>
      </div>
    </div>
  );
}
