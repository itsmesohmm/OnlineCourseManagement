'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { readJsonResponse } from '@/lib/http';
import type { MessageResponse } from '@/lib/types';

interface RegistrationForm {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegistrationForm>({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await readJsonResponse<MessageResponse>(response);
      if (!response.ok) throw new Error(data.error || 'Registration failed.');
      window.location.href = '/dashboard';
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-aside">
        <span className="eyebrow">START YOUR JOURNEY</span>
        <h1>Make learning<br />a daily habit.</h1>
        <p>Create an account to enroll in courses and track your progress.</p>
        <div className="auth-aside-bottom">LearnSpace · Learn at your own pace</div>
      </div>
      <div className="auth-form-wrap">
        <form className="form-card" onSubmit={submit}>
          <span className="eyebrow">CREATE YOUR ACCOUNT</span>
          <h2>Join LearnSpace</h2>
          <p className="form-intro">Fill in your details to get started.</p>
          {error && <div role="alert" className="alert error">{error}</div>}
          <label>Full name<input required autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>
          <label>Email address<input type="email" required autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>
          <label>Password<input type="password" minLength={6} required autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 6 characters" /></label>
          <button className="button primary full" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
          <p className="form-bottom">Already registered? <Link href="/login">Log in</Link></p>
        </form>
      </div>
    </div>
  );
}
