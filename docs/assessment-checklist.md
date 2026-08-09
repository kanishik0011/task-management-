# Full Stack Developer Assessment Checklist

## Part 1 - Task Management System

- [x] Next.js App Router frontend
- [x] Tailwind CSS styling
- [x] TypeScript strict mode
- [x] NestJS backend
- [x] Prisma ORM
- [x] SQLite database for local/demo completion
- [x] Guest login/session creation
- [x] Guest-scoped tasks
- [x] Create task
- [x] Read task list
- [x] Edit task
- [x] Delete task with confirmation
- [x] Change task status
- [x] Client-side form validation with Zod
- [x] Backend DTO validation with class-validator
- [x] Reusable UI/components
- [x] Typed API layer
- [x] Loading, empty, and error states
- [x] Theme switching
- [x] Theme persistence after refresh
- [x] Responsive desktop/tablet/mobile layout
- [x] Swagger/OpenAPI docs
- [x] README
- [x] Multiple meaningful Git commits
- [x] Backend tests
- [x] Frontend form behavior tests
- [x] Vercel frontend configuration
- [x] Static frontend export for Vercel
- [ ] Exact Figma token matching after direct Figma inspection
- [x] Public GitHub repository URL: `https://github.com/kanishik0011/task-management-`
- [ ] Deployed frontend URL
- [ ] Deployed backend URL

## Part 2 - Product Understanding

- [x] Product workflow document created
- [x] Entry point described from supplied Caseload screenshot
- [x] Entry point screenshot added to `docs/screenshots/take-data-entry-point.png`
- [x] UX/UI observations included
- [x] Functional improvements included
- [ ] Add remaining screenshots from manual Take Data walkthrough
- [ ] Replace inferred steps with observed screenshots after product access

## Verification

- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run vercel-build`
- [x] `npm audit`
- [x] Local API health check
- [x] Local guest login and task fetch check

## Deployment Settings

Use these Vercel settings if deploying the frontend from `apps/web`:

- Root Directory: `apps/web`
- Install Command: `npm install`
- Build Command: `npm run vercel-build`
- Output Directory: `out`

Alternative root-repo deployment is also supported by the root `vercel.json`:

- Root Directory: repository root / empty
- Install Command: `npm install`
- Build Command: `npm run vercel-build`
- Output Directory: `apps/web/out`

## Local Preview

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- Swagger: `http://localhost:4000/docs`
