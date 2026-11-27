'use client';

import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';
import { readJsonResponse } from '@/lib/http';
import type { CourseDto, CourseResponse, MessageResponse } from '@/lib/types';

type CourseDetailsProps = {
  params: Promise<{ id: string }>;
};

export default function CourseDetails({ params }: CourseDetailsProps) {
  const [course, setCourse] = useState<CourseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCourse(): Promise<void> {
      try {
        const { id } = await params;
        const response = await fetch(`/api/courses/${id}`);
        const data = await readJsonResponse<CourseResponse>(response);
        if (!response.ok || !data.course) throw new Error(data.error || 'Course not found.');
        if (!cancelled) setCourse(data.course);
      } catch (caught: unknown) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'Unable to load this course.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadCourse();
    return () => { cancelled = true; };
  }, [params]);

  async function enroll(): Promise<void> {
    if (!course) return;
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id }),
      });
      const data = await readJsonResponse<MessageResponse>(response);
      if (!response.ok) throw new Error(data.error || 'Could not enroll.');
      setMessage('You are enrolled! Your dashboard is ready.');
    } catch (caught: unknown) {
      setMessage(caught instanceof Error ? caught.message : 'Could not enroll.');
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
      <div className="detail-hero" style={{ '--course-accent': course.accent ?? '#2563eb' } as CSSProperties}>
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
            {course.modules.map((module, index) => (
              <div className="module-preview" key={module._id}>
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
          <div className="enroll-fact"><span>Modules</span><strong>{course.modules.length}</strong></div>
          <button onClick={enroll} disabled={busy} className="button primary full">{busy ? 'Enrolling…' : 'Enroll in course'}</button>
          {message && <div role="status" className={`alert ${message.includes('enrolled') ? 'success' : 'error'}`}>{message}</div>}
          <p className="panel-note">Enroll to start learning and track your progress.</p>
        </aside>
      </div>
    </section>
  );
}
