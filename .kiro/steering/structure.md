# Project Structure

## Directory Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Locale-based routing (en, ko, zh, ja)
│   │   ├── page.tsx       # Homepage
│   │   ├── login/         # Login page
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
│
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
│
├── contexts/             # React contexts (auth-context)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and constants
│   ├── constants.ts      # App constants
│   ├── utils.ts          # General utilities
│   ├── prisma.ts         # Prisma client singleton
│   ├── api-error.ts      # API error handling
│   ├── api-response.ts   # API response formatting
│   ├── password.ts       # Password hashing & validation (Phase 3)
│   ├── rate-limit.ts     # Rate limiting utility (Phase 3)
│   ├── auth-helpers.ts   # Auth utility functions (Phase 3)
│   ├── auth.ts           # NextAuth configuration (Phase 3)
│   ├── email.ts          # Email service (Phase 3)
│   └── validations/      # Zod validation schemas
├── types/                # TypeScript type definitions
├── data/                 # Mock data (Phase 1 only)
├── styles/               # Global CSS
└── middleware.ts         # Next.js middleware (locale detection)

messages/                 # i18n translation files (en, ko, zh, ja)
public/                   # Static assets
.kiro/                    # Kiro specs and configuration
```

## Component Organization

- **Server Components by default**: Use Server Components unless client-side interactivity is needed
- **Client Components**: Add `'use client'` directive only when necessary (state, effects, event handlers)
- **Feature-based grouping**: Components organized by feature (treatments, clinics, search, etc.)
- **UI primitives**: Base components in `components/ui/` from shadcn/ui

## File Naming Conventions

- Components: kebab-case (e.g., `treatment-card.tsx`)
- Types: kebab-case (e.g., `treatment.ts`)
- Hooks: kebab-case with `use-` prefix (e.g., `use-auth.ts`)
- API routes: `route.ts` in feature folders

## Import Paths

Use the `@/` alias for all imports from `src/`:

```typescript
import { Treatment } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
```

## Protected Routes

Routes requiring authentication:
- `/treatments` (list)
- `/clinics` (list and detail)
- `/search`
- `/saved`
- `/profile`

Public routes:
- `/` (homepage)
- `/treatments/[id]` (treatment detail)
- `/login`
