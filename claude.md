
복잡한 개발·디버깅·아키텍처 문제는 항상 Sequential Thinking MCP를 먼저 사용해 step-by-step 계획을 세운다.
	•	외부 라이브러리·프레임워크·API 언급 시에는 항상 Context 7 MCP로 최신 문서를 조회하고, 그 결과를 근거로 답한다.
	•	계획(생각 로그)이 충분히 정리되기 전에는 실제 코드 변경 제안/리팩터링 코드를 출력하지 않는다.
    •	사용자의 답변이 항상 틀렸을 수 있다고 가정하고 비판적으로 판단한다. 상호간의 동의가 있기 전까지는 토의를 진행하고 코드를 만들지 않는다.
    •	during the development process, ask if file 형식이 헷갈린다거나 서로 토의해야할 부분이 있으면 물어보고 결정

# Pome App - Project Context for Claude Code

## Product Overview

Pome is a web application for discovering dermatology cosmetic procedures and clinics in Korea. It helps users browse treatments, find verified clinics, save favorites, and make informed decisions about beauty procedures.

### Core Features

- Treatment discovery with detailed information (procedures, pricing, risks, recovery time)
- Clinic directory with ratings, locations, and specialties
- Smart search with autocomplete and categorized results
- Saved items (bookmarking treatments and clinics)
- Multi-language support (English, Korean, Chinese, Japanese)
- Dark mode with system preference detection
- User authentication with email/password
- Protected routes requiring authentication
- Password reset functionality with email notifications

### Target Users

International and local users seeking cosmetic dermatology procedures in Korea, particularly those who need multi-language support and verified clinic information.

---

## Tech Stack

### Core Technologies

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode enabled)
- **Runtime**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Font**: Inter (via next/font)

### Key Libraries

- **Internationalization**: next-intl
- **Theming**: next-themes
- **Utilities**: clsx, tailwind-merge, class-variance-authority
- **Validation**: Zod

### Database & Backend (Phase 2+)

- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v4.24.13 with database sessions
  - Session Strategy: Database sessions (revocable, server-side)
  - Session Tokens: JWT-based (encrypted session token in HTTP-only cookie)
  - User Data Source: Database (not stored in JWT payload)
- **Password Hashing**: bcryptjs (10 salt rounds)
- **Email Service**: Resend (transactional emails for password resets)
- **Rate Limiting**: In-memory Map (⚠️ per-instance only, upgrade to Redis in Phase 5)

### Phase 3 Dependencies

```json
{
  "next-auth": "^4.24.13",
  "@next-auth/prisma-adapter": "^1.0.7",
  "bcryptjs": "^3.0.3",
  "@types/bcryptjs": "^2.4.6",
  "resend": "^6.4.2",
  "zod": "^3.x"
}
```

### Deployment

- **Platform**: Vercel
- **Database Hosting**: Neon (ap-southeast-1 region)

### Common Commands

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

### TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Target: ES2017
- Module resolution: bundler

### Build System

- Next.js bundler (Turbopack in dev mode)
- PostCSS with Tailwind CSS v4
- Automatic code splitting and optimization

---

## Project Structure

### Directory Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Locale-based routing (en, ko, zh, ja)
│   │   ├── page.tsx       # Homepage
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page (Phase 3)
│   │   ├── forgot-password/ # Password reset request (Phase 3)
│   │   ├── reset-password/  # Password reset form (Phase 3)
│   │   ├── treatments/    # Treatment list & detail pages
│   │   ├── clinics/       # Clinic list & detail pages
│   │   ├── search/        # Search results page
│   │   ├── saved/         # Saved items page (protected)
│   │   └── profile/       # User profile page (protected)
│   └── api/               # API routes (Phase 2+)
│       └── auth/          # Authentication endpoints (Phase 3)
│           ├── [...nextauth]/ # NextAuth.js handler
│           ├── register/  # User registration
│           ├── forgot-password/ # Password reset request
│           └── reset-password/  # Password reset confirmation

├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── layout/           # Header, BottomNav
│   ├── cards/            # Card components (treatment, clinic)
│   ├── forms/            # Form components
│   ├── filters/          # Filter sidebars
│   ├── search/           # Search-related components
│   ├── auth/             # Authentication components
│   ├── profile/          # Profile components
│   ├── treatments/       # Treatment-specific components
│   ├── clinics/          # Clinic-specific components
│   └── saved/            # Saved items components

├── contexts/             # React contexts
│   └── auth-context.tsx  # Authentication context (NextAuth wrapper)

├── hooks/                # Custom React hooks
│   └── use-auth.ts       # Authentication hook

├── lib/                  # Utility functions and constants
│   ├── constants.ts      # App constants
│   ├── utils.ts          # General utilities
│   ├── prisma.ts         # Prisma client singleton
│   ├── api-error.ts      # API error handling
│   ├── api-response.ts   # API response formatting
│   ├── password.ts       # Password hashing & validation (Phase 3)
│   ├── rate-limit.ts     # Rate limiting utility (Phase 3)
│   ├── auth-helpers.ts   # Auth utility functions (Phase 3)
│   ├── auth.ts           # NextAuth configuration (Phase 3 - Task 4)
│   └── email.ts          # Email service (Phase 3 - Task 7)

├── lib/validations/      # Zod validation schemas
│   └── ...               # Validation schemas by feature

├── types/                # TypeScript type definitions
│   ├── treatment.ts      # Treatment types
│   ├── clinic.ts         # Clinic types
│   └── next-auth.d.ts    # NextAuth type extensions (Phase 3)

├── data/                 # Mock data (Phase 1 only, deprecated)
├── styles/               # Global CSS
└── middleware.ts         # Next.js middleware (locale + auth)

messages/                 # i18n translation files (en, ko, zh, ja)
public/                   # Static assets
prisma/                   # Prisma schema and migrations
  ├── schema.prisma       # Database schema
  ├── migrations/         # Database migrations
  └── seed.ts            # Database seed script
.kiro/                    # Kiro specs and configuration
  ├── specs/              # Phase specifications
  └── steering/           # Project steering documents
```

### Component Organization

- **Server Components by default**: Use Server Components unless client-side interactivity is needed
- **Client Components**: Add `'use client'` directive only when necessary (state, effects, event handlers)
- **Feature-based grouping**: Components organized by feature (treatments, clinics, search, etc.)
- **UI primitives**: Base components in `components/ui/` from shadcn/ui

### File Naming Conventions

- Components: kebab-case (e.g., `treatment-card.tsx`)
- Types: kebab-case (e.g., `treatment.ts`)
- Hooks: kebab-case with `use-` prefix (e.g., `use-auth.ts`)
- API routes: `route.ts` in feature folders
- Pages: `page.tsx` in route folders

### Import Paths

Use the `@/` alias for all imports from `src/`:

```typescript
import { Treatment } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
```

### Protected Routes

Routes requiring authentication (enforced by middleware):
- `/saved` - Saved items page
- `/profile` - User profile page

Public routes (accessible without authentication):
- `/` - Homepage
- `/treatments` - Treatment list
- `/treatments/[id]` - Treatment detail
- `/clinics` - Clinic list
- `/clinics/[id]` - Clinic detail
- `/search` - Search results
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form

---

## Database Schema (Phase 2+)

### Core Models

- **User** - User accounts with authentication
  - Fields: id, email, passwordHash, name, emailVerified, language, gender, ageRange, skinType, treatmentGoals
  - Relations: accounts, sessions, savedItems

- **Treatment** - Cosmetic procedures
  - Fields: id, name, slug, description, icon, pricing, duration, recoveryTime, risks, categories, beforeAfterImages, suitableFor
  - Relations: clinicMappings

- **Clinic** - Medical facilities
  - Fields: id, name, slug, location, address, description, imageUrl, rating, reviewCount, specialties, kakaoMapLink, verified, priceLevel, openingHours, phoneNumber, websiteUrl, photos
  - Relations: treatments

- **ClinicTreatment** - Junction table (clinic-treatment relationship with pricing)
  - Fields: id, clinicId, treatmentId, price, availability

- **SavedItem** - User's saved treatments/clinics
  - Fields: id, userId, itemType, itemId, notes, savedAt

### NextAuth Models (Phase 3)

- **Account** - OAuth provider accounts (Phase 6)
- **Session** - Database sessions for NextAuth
- **VerificationToken** - Password reset and email verification tokens

### Test Users (Phase 3)

All test users have password: `password123`
- test@pome.com - Test User
- sarah.kim@example.com - Sarah Kim
- john.park@example.com - John Park
- minji.lee@example.com - Minji Lee
- emma.chen@example.com - Emma Chen

---

## Authentication Architecture (Phase 3)

### Session Strategy

- **Type**: Database sessions (not JWT-only)
- **Storage**: Session table in PostgreSQL
- **Cookie**: Encrypted JWT containing session token ID (HTTP-only, Secure, SameSite=Lax)
- **Expiration**: 30 days with 24-hour refresh
- **Revocability**: Yes (delete from Session table)

### Password Security

- **Hashing**: bcryptjs with 10 salt rounds
- **Requirements**: Min 8 chars, max 128 chars, at least 1 letter and 1 number
- **Reset Tokens**: SHA-256 hashed, 1-hour expiration
- **Storage**: Never log or expose passwords

### Rate Limiting (Phase 3)

⚠️ **Current Implementation**: In-memory Map (per-instance only)
- **Limitation**: Does not work across multiple Vercel instances
- **Acceptable for**: Phase 3 MVP with single-region, low-traffic deployment
- **Upgrade Path**: Vercel KV or Upstash Redis in Phase 5

Rate limits:
- Registration: 5 requests per 10 minutes per IP
- Forgot Password: 10 requests per 10 minutes per IP
- Login: 10 requests per 5 minutes (handled by NextAuth)

### Email Service

- **Provider**: Resend
- **Use Cases**: Password reset emails
- **Development**: Uses `onboarding@resend.dev` (no domain verification needed)
- **Production**: Requires verified domain in Resend dashboard

---

## Environment Variables

### Required (Phase 3)

```env
# Database
DATABASE_URL="postgresql://..."  # Neon pooled connection
DIRECT_URL="postgresql://..."    # Neon direct connection (for migrations)

# NextAuth
NEXTAUTH_URL="http://localhost:3000"  # Production: https://your-domain.com
NEXTAUTH_SECRET="..."  # Generate with: openssl rand -base64 32

# Email Service
RESEND_API_KEY="re_..."  # Get from https://resend.com/api-keys
EMAIL_FROM="onboarding@resend.dev"  # Dev: resend test domain, Prod: verified domain

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Key Design Decisions

### 1. Database Sessions over JWT-only
- **Reason**: Session revocability for password resets and security incidents
- **Tradeoff**: Slight DB query overhead (mitigated by indexing)

### 2. In-memory Rate Limiting (Phase 3)
- **Reason**: Simple implementation for MVP, no external dependencies
- **Limitation**: Per-instance only, bypassed in multi-instance deployments
- **Mitigation**: Low-traffic single-region deployment in Phase 3, upgrade to Redis in Phase 5

### 3. bcryptjs over native bcrypt
- **Reason**: Pure JavaScript, works in all environments (Vercel Edge Functions)
- **Tradeoff**: Slightly slower than native bcrypt (acceptable for 10 salt rounds)

### 4. Resend over SendGrid/AWS SES
- **Reason**: Modern API, React Email support, generous free tier
- **Advantage**: No domain verification needed for development testing

### 5. Server Components First
- **Reason**: Better performance, smaller client bundles, improved SEO
- **Pattern**: Use Server Components by default, Client Components only when needed

---

## Current Development Status

### Completed
- ✅ Phase 1: UI/UX with mock data
- ✅ Phase 2: Database integration with Neon + Prisma
- ✅ Phase 3 - Task 1: Project setup and dependencies
- ✅ Phase 3 - Task 2: Database schema updates (User, Account, Session, VerificationToken)
- ✅ Phase 3 - Task 3: Core authentication utilities (password, rate-limit, auth-helpers)

### In Progress
- 🔄 Phase 3 - Task 4: NextAuth.js configuration

### Next Steps
- Task 4: NextAuth.js Configuration (5 subtasks)
- Task 5: User Registration System (4 subtasks)
- Task 6: Login System Updates (3 subtasks)
- Task 7: Password Reset System (7 subtasks)
- Task 8-16: Session management, route protection, UI updates, testing, documentation

---

## Important Notes

### For Claude Code Assistance

1. **Always use Server Components** unless client-side features are required (useState, useEffect, event handlers)
2. **Use the `@/` import alias** for all src imports
3. **Follow existing file naming conventions** (kebab-case)
4. **Database sessions, not JWT-only** - user data comes from DB, not JWT payload
5. **Rate limiting has multi-instance limitation** - document this when implementing
6. **Test users exist** - password is `password123` for all test accounts
7. **Middleware combines i18n + auth** - must chain middlewares correctly
8. **Email uses Resend** - development uses test domain, production needs verified domain

### Security Considerations

- Never log passwords or password hashes
- Always use bcrypt for password hashing (10 salt rounds)
- Validate all user inputs with Zod schemas
- Use HTTP-only cookies for sessions
- Implement rate limiting on authentication endpoints
- Hash password reset tokens with SHA-256
- Set 1-hour expiration on reset tokens
- Delete all existing sessions on password reset

### Performance Considerations

- Database indexes on: email, sessionToken, slug fields
- Connection pooling via Prisma
- Cleanup interval for expired rate limit entries (every 5 minutes)
- Session validation cached by NextAuth
- Async email sending (non-blocking)
