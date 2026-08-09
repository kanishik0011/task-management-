# Submission Guide

## Current Status

The codebase is ready to upload to GitHub. Local validation is passing:

- `npm run lint`
- `npm run test`
- `npm run build`

The local full-stack preview works with SQLite:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- Swagger: `http://localhost:4000/docs`

## Before Submitting the Assessment Form

Complete these external steps:

- Create a public GitHub repository.
- Push this local repo to GitHub.
- Deploy the frontend.
- Deploy the backend.
- Add the deployed URLs to `README.md`.
- Test the deployed app in an incognito/private browser.
- Keep the GitHub repo public and deployments active for at least 45 days.

## GitHub Upload Commands

After logging into GitHub:

```bash
gh auth login
gh repo create task-management-assessment --public --source . --remote origin --push
```

If the repository already exists:

```bash
git remote add origin https://github.com/<your-username>/task-management-assessment.git
git branch -M main
git push -u origin main
```

## Deployment Notes

Recommended simple deployment path:

- Frontend: Vercel
- Backend: Render, Railway, Fly.io, or another Node host
- Database: SQLite with persistent disk for a simple demo, or PostgreSQL if your backend host provides managed Postgres

## Vercel Frontend Settings

Use these settings when importing the GitHub repository into Vercel:

```text
Framework Preset: Next.js
Root Directory: leave empty / repository root
Install Command: npm install
Build Command: npm run vercel-build
Output Directory: apps/web/out
```

Add this Vercel environment variable:

```bash
NEXT_PUBLIC_API_URL=https://your-deployed-api-url
```

The frontend will build on Vercel without the backend running, but task loading only works after `NEXT_PUBLIC_API_URL` points to the deployed Nest API.

The frontend has a browser-local demo fallback if the API is unreachable, so the page will remain usable during preview. For the assessment submission, still provide the deployed backend URL because the assignment asks for a working API.

The frontend is configured as a static export. If Vercel previously showed `FUNCTION_INVOCATION_FAILED`, redeploy from the latest `main` commit so Vercel serves the static `out` directory instead of a crashed serverless function.

Required production environment variables:

```bash
NEXT_PUBLIC_API_URL=https://your-api-url
DATABASE_URL=file:./dev.db
JWT_SECRET=use-a-long-random-secret
FRONTEND_URL=https://your-frontend-url
PORT=4000
```

For the backend deployment, run:

```bash
npm install
npm run prisma:generate -w apps/api
npm run db:setup -w apps/api
npm run build -w apps/api
npm run start -w apps/api
```

## Final Manual Test

Use a fresh browser session and confirm:

- Guest session is created automatically.
- Seeded tasks load.
- Create task works.
- Edit task works.
- Status update works.
- Delete confirmation works.
- Theme switching works.
- Theme persists after refresh.
- Swagger opens for the deployed API.
- No production page points to `localhost`.
