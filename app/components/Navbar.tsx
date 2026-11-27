'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readJsonResponse } from '@/lib/http';
import type { UserDto, UserResponse } from '@/lib/types';

export default function Navbar() {
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    void fetch('/api/auth/me')
      .then((response) => response.ok ? readJsonResponse<UserResponse>(response) : null)
      .then((data) => setUser(data?.user ?? null))
      .catch(() => undefined);
  }, []);

  async function logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link href="/" className="brand"><span className="brand-mark">L</span> LearnSpace</Link>
        <nav>
          <Link href="/courses">Courses</Link>
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <button className="nav-button" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href="/register" className="nav-cta">Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
