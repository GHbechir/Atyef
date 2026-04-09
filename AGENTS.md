<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Dev Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run lint      # ESLint only (no typecheck/test scripts)
```

## Stack

- **Next.js 16.2.3** with App Router — has breaking changes from earlier versions
- **Tailwind CSS v4** — uses `@tailwindcss/postcss`, not `tailwindcss` v3 config approach
- **shadcn/ui** — style variant is `base-nova`, not `default`; components in `src/components/ui/`
- **Prisma 7** — PostgreSQL; schema in `prisma/schema.prisma`; db client in `src/lib/db.ts`
- **Clerk** — authentication
- **Stripe** — payments/subscriptions
- **Zustand** — state management
- **base-ui/react** — used alongside shadcn components

## Architecture

### Route Groups
- `(auth)/` — sign-in, sign-up pages
- `(dashboard)/` — protected dashboard with role-based layouts
- `(public)/` — public pages (courses, pricing)

### Dashboard Roles (route-based)
- `/learn/*` — Learner role
- `/teach/*` — Teacher role  
- `/admin/*` — Admin role

### Key Files
- `src/app/globals.css` — CSS variables using oklch colors, custom animations (animate-float, glass, gradient-text)
- `src/lib/db.ts` — Prisma client singleton
- `src/lib/utils.ts` — `cn()` helper (clsx + twMerge)
- `src/types/index.ts` — shared TypeScript types
- `components.json` — shadcn/ui config (aliases: `@/components`, `@/lib`, `@/hooks`)

## Database

Prisma schema defines: User, Instrument, Course, Lesson, LessonResource, Enrollment, CourseProgress, LessonProgress, Subscription

After schema changes: `npx prisma generate` then `npx prisma db push`

## Styling Conventions

- Uses oklch color format (e.g., `oklch(0.58 0.22 280)`)
- Custom classes: `.glass`, `.glass-card`, `.gradient-text`, `.animate-float`, `.animate-pulse-glow`
- Animation delays: `.delay-100` through `.delay-500`
- Dark theme is default (`dark h-full` on `<html>`)
- Font variables: `--font-sans` (Inter), `--font-heading` (Outfit), `--font-mono` (JetBrains Mono)

## Required Environment Variables

See `.env.local` (not committed). Typically needs:
- `DATABASE_URL` — PostgreSQL
- `CLERK_*` — Clerk auth keys
- `STRIPE_*` — Stripe keys
