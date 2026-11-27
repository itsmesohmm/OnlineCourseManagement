'use client';

import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';
import { readJsonResponse } from '@/lib/http';
import type { CourseDto, CoursesResponse } from '@/lib/types';

const colors: Record<string, string> = {
  Development: '#2563eb',
  Programming: '#059669',
  Cybersecurity: '#7c3aed',
  Data: '#ea580c',
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void fetch('/api/courses')
      .then((response) => readJsonResponse<CoursesResponse>(response))
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setCourses(data.courses ?? []);
      })
      .catch((caught: unknown) => setError(caught instanceof Error ? caught.message : 'Unable to load courses.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(courses.map((course) => course.category)))];
  const filteredCourses = courses.filter((course) => (
    (category === 'All' || course.category === category)
    && `${course.title} ${course.description} ${course.category}`.toLowerCase().includes(query.toLowerCase())
  ));

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <span className="eyebrow">COURSE CATALOG</span>
          <h1>Explore courses</h1>
          <p>Find a topic, learn something useful, and move forward.</p>
        </div>
      </div>
      <div className="catalog-controls">
        <input
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search courses..."
          aria-label="Search courses"
        />
        <div className="category-filters" aria-label="Filter by category">
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`filter-chip ${category === item ? 'active' : ''}`}>
              {item}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="empty-state">Loading courses…</div>
      ) : error ? (
        <div role="alert" className="alert error">{error}</div>
      ) : filteredCourses.length === 0 ? (
        <div className="empty-state">No courses match your search.</div>
      ) : (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <article className="course-card" key={course._id}>
              <div
                className="course-art"
                style={{ '--course-accent': course.accent ?? colors[course.category] ?? '#2563eb' } as CSSProperties}
              >
                <span className="course-art-mark">
                  {course.category === 'Cybersecurity' ? '⌘' : course.category === 'Data' ? '▥' : course.category === 'Programming' ? '{}' : '⌁'}
                </span>
                <span className="course-category">{course.category}</span>
              </div>
              <div className="course-card-body">
                <div className="course-meta"><span>{course.level}</span><span>·</span><span>{course.duration}</span></div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-card-footer">
                  <span>By {course.instructor}</span>
                  <Link href={`/courses/${course._id}`} className="text-link">View course →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
