# LearnSpace — Online Course Management System

A student course portal built with Next.js App Router, MongoDB Atlas, Mongoose and regular CSS. It supports registration/login, course catalog, enrollment, student dashboard and module completion progress.


## Requirements
- Node.js 20+ recommended
- MongoDB Atlas account / database

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` in the project root. Copy values from `.env.example` and set:
   - `MONGODB_URI`: your MongoDB Atlas connection URI
   - `JWT_SECRET`: a long random string (used to sign the session cookie)
3. Run:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

Course demo data is automatically inserted the first time the course API is called if the Courses collection is empty.


## Main features
- Student registration and login
- Password hashing with Node's built-in PBKDF2 (`crypto`)
- Signed, HTTP-only session cookie
- Course catalog, search and category filtering
- Course detail and enrollment
- Dashboard with course progress
- Module completion stored in MongoDB
- API routes for authentication, courses, enrollment and progress

## API routes
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account and session |
| POST | `/api/auth/login` | Login and session |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/auth/me` | Current session user |
| GET | `/api/courses` | List courses (also initializes demo courses) |
| GET | `/api/courses/:id` | Get one course |
| GET | `/api/enrollments` | List current student's enrollments |
| POST | `/api/enrollments` | Enroll in a course |
| PATCH | `/api/progress/:enrollmentId` | Mark a module complete/incomplete |

## Deployment on Vercel
- Push this project to GitHub.
- Import the repository in Vercel.
- In Project Settings → Environment Variables, add `MONGODB_URI` and `JWT_SECRET`.
- Deploy.
- Confirm Atlas Network Access allows Vercel connections (for a quick student demo, Atlas's `0.0.0.0/0` entry may be used, with a strong DB password; tighten access for production).

## Notes
- The app intentionally uses plain CSS, not Tailwind.
- Authentication uses built-in crypto rather than bcrypt.
- Demo course data is seeded only when the Courses collection is empty.
- This is a class assignment/demo implementation. Before production use, add rate limiting, stricter input validation, CSRF protections for state-changing requests, and a more comprehensive account/session management strategy.

## Troubleshooting

If the app shows `Unexpected token '<', '<!DOCTYPE...' is not valid JSON`, a route returned an HTML error page instead of JSON. The updated version handles that response more clearly and checks `MONGODB_URI` inside the database connection function. Confirm `.env.local` is in the project root (same level as `package.json`), contains `MONGODB_URI` and `JWT_SECRET`, then stop and restart `npm run dev`.

For MongoDB Atlas, ensure your database user exists and your current IP is allowed under Network Access.
