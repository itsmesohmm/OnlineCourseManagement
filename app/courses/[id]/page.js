'use client';

import { readJsonResponse } from '@/lib/http';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CourseDetails({ params }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCourse() {
      try {
        const { id } = await params;
        const response = await fetch(`/api/courses/${id}`);
        const data = await readJsonResponse(response);
        if (!response.ok || !data.course) throw new Error(data.error || 'Course not found.');
        if (!cancelled) setCourse(data.course);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || 'Unable to load this course.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCourse();
    return () => { cancelled = true; };
  }, [params]);

  async function enroll() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id }),
      });
      const data = await readJsonResponse(response);
      if (!response.ok) throw new Error(data.error || 'Could not enroll.');
      setMessage('You are enrolled! Your dashboard is ready.');
    } catch (enrollError) {
      setMessage(enrollError.message || 'Could not enroll.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="empty-state">Loading course…</div>;
  if (error) return <div className="empty-state"><p>{error}</p><Link href="/courses" className="text-link">Back to courses</Link></div>;
  if (!course) return <div className="empty-state">Course not found.</div>;

  return (
    <section className="page-section">
      <Link href="/courses" className="back-link">← All courses</Link>
      <div className="detail-hero" style={{ '--course-accent': course.accent || '#2563eb' }}>
        <div>
          <span className="course-category">{course.category}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="detail-meta"><span>{course.level}</span><span>{course.duration}</span><span>Instructor: {course.instructor}</span></div>
        </div>
        <div className="detail-hero-symbol" aria-hidden="true">✦</div>
      </div>
      <div className="detail-layout">
        <div className="detail-main">
          <h2>About this course</h2>
          <p>{course.description}</p>
          <h2>Course curriculum</h2>
          <div className="module-list">
            {course.modules?.map((module, index) => (
              <div className="module-preview" key={module._id || module.title}>
                <span className="module-number">{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{module.title}</strong><p>{module.description}</p></div>
              </div>
            ))}
          </div>
        </div>
        <aside className="enroll-panel">
          <h3>Course details</h3>
          <div className="enroll-fact"><span>Instructor</span><strong>{course.instructor}</strong></div>
          <div className="enroll-fact"><span>Level</span><strong>{course.level}</strong></div>
          <div className="enroll-fact"><span>Duration</span><strong>{course.duration}</strong></div>
          <div className="enroll-fact"><span>Modules</span><strong>{course.modules?.length || 0}</strong></div>
          <button onClick={enroll} disabled={busy} className="button primary full">{busy ? 'Enrolling…' : 'Enroll in course'}</button>
          {message && <div role="status" className={`alert ${message.includes('enrolled') ? 'success' : 'error'}`}>{message}</div>}
          <p className="panel-note">Enroll to start learning and track your progress.</p>
        </aside>
      </div>
    </section>
  );
}
