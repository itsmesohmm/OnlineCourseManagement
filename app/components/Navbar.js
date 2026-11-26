'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
export default function Navbar() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => setUser(d?.user || null)).catch(() => {}); }, []);
  async function logout() { await fetch('/api/auth/logout', { method: 'POST' }); setUser(null); window.location.href = '/'; }
  return <header className="navbar"><div className="nav-inner"><Link href="/" className="brand"><span className="brand-mark">L</span> LearnSpace</Link><nav><Link href="/courses">Courses</Link>{user ? <><Link href="/dashboard">Dashboard</Link><button className="nav-button" onClick={logout}>Log out</button></> : <><Link href="/login">Log in</Link><Link href="/register" className="nav-cta">Get started</Link></>}</nav></div></header>;
}
