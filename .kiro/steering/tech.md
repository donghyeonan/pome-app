# Tech Stack

## Core Technologies

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode enabled)
- **Runtime**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Font**: Inter (via next/font)

## Key Libraries

- **Internationalization**: next-intl
- **Theming**: next-themes
- **Utilities**: clsx, tailwind-merge, class-variance-authority
- **Validation**: Zod

## Database & Backend (Phase 2+)

- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v4.24.13 with database sessions
  - Session Strategy: Database sessions (revocable, server-side)
  - Session Tokens: JWT-based (encrypted session token in HTTP-only cookie)
  - User Data Source: Database (not stored in JWT payload)
- **Password Hashing**: bcryptjs (10 salt rounds)
- **Email Service**: Resend (transactional emails for password resets)
- **Rate Limiting**: In-memory Map (⚠️ per-instance only, upgrade to Redis in Phase 5)
- **Deployment**: Vercel

## Common Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server

# Database (Phase 2+)
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database with test data
npm run db:studio    # Open Prisma Studio (http://localhost:5555)
npm run db:push      # Push schema changes (dev only)

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

## TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Target: ES2017
- Module resolution: bundler

## Build System

- Next.js bundler (Turbopack in dev mode)
- PostCSS with Tailwind CSS v4
- Automatic code splitting and optimization
