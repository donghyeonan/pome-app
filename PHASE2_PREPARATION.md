# Phase 2 Preparation Guide

This document outlines the preparation work completed in Phase 1 to ensure a smooth transition to Phase 2 (Database Integration).

## Overview

Phase 1 has been designed with Phase 2 in mind. All TypeScript interfaces, component structures, and data flows are ready for database integration with minimal refactoring required.

## TypeScript Interfaces → Prisma Schema Mapping

### ✅ User Type

**Current TypeScript Interface** (`src/types/user.ts`):
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  languagePreference: 'en' | 'ko' | 'zh' | 'ja';
  gender?: 'male' | 'female' | 'other';
  ageRange?: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  skinType?: 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';
  treatmentGoals?: string[];
  createdAt: Date;
}
```

**Corresponding Prisma Model**:
```prisma
model User {
  id                 String    @id @default(cuid())
  email              String    @unique
  password_hash      String
  name               String
  languagePreference String    @default("en")
  gender             String?
  ageRange           String?
  skinType           String?
  treatmentGoals     String[]
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  savedItems         SavedItem[]
}
```

**Status**: ✅ Fully compatible. Add `password_hash` and `updatedAt` during Phase 3 (Authentication).

---

### ✅ Treatment Type

**Current TypeScript Interface** (`src/types/treatment.ts`):
```typescript
export interface Treatment {
  id: string;
  name: string;
  description: string;
  icon: string;
  priceRange: {
    min: number;
    max: number;
    currency: 'KRW' | 'USD';
  };
  duration: string;
  risks: string[];
  categories: string[];
  recoveryTime: string;
  beforeAfterImages?: {
    before: string;
    after: string;
  }[];
  suitableFor?: {
    skinTypes: string[];
    ageRanges: string[];
    goals: string[];
  };
}
```

**Corresponding Prisma Model**:
```prisma
model Treatment {
  id                String            @id @default(cuid())
  name              String
  description       String            @db.Text
  icon              String
  priceRangeMin     Int
  priceRangeMax     Int
  currency          String            @default("KRW")
  duration          String
  risks             String[]
  categories        String[]
  recoveryTime      String
  beforeAfterImages Json?
  suitableFor       Json?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  clinics           ClinicTreatment[]
}
```

**Status**: ✅ Fully compatible. Nested objects (`priceRange`, `beforeAfterImages`, `suitableFor`) will be flattened or stored as JSON.

**Migration Notes**:
- `priceRange.min` → `priceRangeMin`
- `priceRange.max` → `priceRangeMax`
- `priceRange.currency` → `currency`
- `beforeAfterImages` → JSON field
- `suitableFor` → JSON field

---

### ✅ Clinic Type

**Current TypeScript Interface** (`src/types/clinic.ts`):
```typescript
export interface Clinic {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount?: number;
  specialties: string[];
  kakaoMapLink?: string;
  verified: boolean;
  priceLevel?: 1 | 2 | 3;
  openingHours?: {
    [key: string]: string;
  };
  phoneNumber?: string;
  websiteUrl?: string;
  photos?: string[];
}
```

**Corresponding Prisma Model**:
```prisma
model Clinic {
  id           String            @id @default(cuid())
  name         String
  location     String
  description  String            @db.Text
  imageUrl     String
  rating       Float             @default(0)
  reviewCount  Int               @default(0)
  specialties  String[]
  kakaoMapLink String?
  verified     Boolean           @default(false)
  priceLevel   Int?
  openingHours Json?
  phoneNumber  String?
  websiteUrl   String?
  photos       String[]
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
  treatments   ClinicTreatment[]
  reviews      Review[]
}
```

**Status**: ✅ Fully compatible. `openingHours` will be stored as JSON.

---

### ✅ ClinicTreatment Junction Type

**Current TypeScript Interface** (`src/types/clinic.ts`):
```typescript
export interface ClinicTreatment {
  clinicId: string;
  treatmentId: string;
  price?: number;
  availability: 'available' | 'limited' | 'unavailable';
}
```

**Corresponding Prisma Model**:
```prisma
model ClinicTreatment {
  clinicId     String
  treatmentId  String
  price        Int?
  availability String    @default("available")
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  clinic       Clinic    @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  treatment    Treatment @relation(fields: [treatmentId], references: [id], onDelete: Cascade)
  
  @@id([clinicId, treatmentId])
  @@index([clinicId])
  @@index([treatmentId])
}
```

**Status**: ✅ Fully compatible.

---

### ✅ SavedItem Type

**Current TypeScript Interface** (`src/types/user.ts`):
```typescript
export interface SavedItem {
  id: string;
  userId: string;
  itemType: 'clinic' | 'treatment';
  itemId: string;
  savedAt: Date;
  notes?: string;
}
```

**Corresponding Prisma Model**:
```prisma
model SavedItem {
  id        String   @id @default(cuid())
  userId    String
  itemType  String
  itemId    String
  notes     String?  @db.Text
  savedAt   DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, itemType, itemId])
  @@index([userId])
}
```

**Status**: ✅ Fully compatible.

---

### ✅ SearchResult Type

**Current TypeScript Interface** (`src/types/search.ts`):
```typescript
export interface SearchResult {
  treatments: Treatment[];
  clinics: Clinic[];
  query: string;
  resultType: 'treatment' | 'clinic' | 'mixed';
}
```

**Status**: ✅ This is a computed type for UI purposes, not stored in database. No Prisma model needed.

---

## Mock Data → API Calls Mapping

### Current Mock Data Files

| Mock Data File | API Route to Replace | HTTP Method | Description |
|---------------|---------------------|-------------|-------------|
| `src/data/treatments.ts` | `/api/treatments` | GET | List all treatments with optional filters |
| `src/data/treatments.ts` | `/api/treatments/[id]` | GET | Get single treatment by ID |
| `src/data/clinics.ts` | `/api/clinics` | GET | List all clinics with optional filters |
| `src/data/clinics.ts` | `/api/clinics/[id]` | GET | Get single clinic by ID |
| `src/data/clinic-treatments.ts` | `/api/clinics/[id]/treatments` | GET | Get treatments offered by a clinic |
| `src/data/clinic-treatments.ts` | `/api/treatments/[id]/clinics` | GET | Get clinics offering a treatment |
| `src/lib/mock-auth.ts` | NextAuth.js | - | Replace with NextAuth.js in Phase 3 |
| `localStorage` (saved items) | `/api/saved` | GET, POST, DELETE | User's saved items |

### Component Data Fetching Patterns

#### Current Pattern (Phase 1 - Mock Data)
```tsx
// src/app/[locale]/treatments/page.tsx
import { treatments } from '@/data/treatments';

export default function TreatmentsPage() {
  return (
    <div>
      {treatments.map(treatment => (
        <TreatmentCard key={treatment.id} treatment={treatment} />
      ))}
    </div>
  );
}
```

#### Future Pattern (Phase 2 - API Calls)
```tsx
// src/app/[locale]/treatments/page.tsx
async function getTreatments() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/treatments`, {
    cache: 'no-store', // or 'force-cache' for ISR
  });
  return res.json();
}

export default async function TreatmentsPage() {
  const treatments = await getTreatments();
  
  return (
    <div>
      {treatments.map(treatment => (
        <TreatmentCard key={treatment.id} treatment={treatment} />
      ))}
    </div>
  );
}
```

---

## API Routes Structure

### Placeholder API Routes Created

The following placeholder API route files have been created in `src/app/api/`:

```
src/app/api/
├── treatments/
│   ├── route.ts              # GET /api/treatments (list with filters)
│   └── [id]/
│       ├── route.ts          # GET /api/treatments/[id] (single treatment)
│       └── clinics/
│           └── route.ts      # GET /api/treatments/[id]/clinics
├── clinics/
│   ├── route.ts              # GET /api/clinics (list with filters)
│   └── [id]/
│       ├── route.ts          # GET /api/clinics/[id] (single clinic)
│       └── treatments/
│           └── route.ts      # GET /api/clinics/[id]/treatments
├── search/
│   └── route.ts              # GET /api/search?q=query
└── saved/
    ├── route.ts              # GET /api/saved, POST /api/saved
    └── [id]/
        └── route.ts          # DELETE /api/saved/[id]
```

Each placeholder file includes:
- TypeScript types for request/response
- Comments indicating Phase 2 implementation
- Proper HTTP method handlers
- Error handling structure

---

## Database Setup Checklist (Phase 2)

### 1. Environment Setup
- [ ] Create Neon database account
- [ ] Create new Neon project
- [ ] Copy connection string to `.env.local`
- [ ] Add `DATABASE_URL` environment variable

### 2. Prisma Setup
```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Create schema (use the models defined above)
# Edit prisma/schema.prisma

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### 3. Prisma Client Setup
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 4. Seed Data Migration
- [ ] Convert mock data to Prisma seed script
- [ ] Run seed script to populate database
- [ ] Verify data integrity

### 5. API Route Implementation
- [ ] Implement `/api/treatments` route
- [ ] Implement `/api/treatments/[id]` route
- [ ] Implement `/api/clinics` route
- [ ] Implement `/api/clinics/[id]` route
- [ ] Implement `/api/search` route
- [ ] Implement `/api/saved` routes

### 6. Component Updates
- [ ] Replace mock data imports with API calls
- [ ] Update Server Components to use `fetch()`
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test all pages

### 7. Testing
- [ ] Test all API routes with Postman/Insomnia
- [ ] Test all pages with real data
- [ ] Test error scenarios
- [ ] Test performance (query optimization)

---

## Search Functionality (Phase 2)

### Current Implementation (Client-Side)
```typescript
// src/hooks/use-search.ts
export function useSearch() {
  const searchTreatments = (query: string) => {
    return treatments.filter(t => 
      t.name.toLowerCase().includes(query.toLowerCase())
    );
  };
  // ...
}
```

### Future Implementation (Server-Side)
```typescript
// src/app/api/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  const treatments = await prisma.treatment.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { categories: { has: query } },
      ],
    },
  });
  
  // ... similar for clinics
  
  return Response.json({ treatments, clinics });
}
```

---

## Authentication Migration (Phase 3)

### Current Implementation (Mock)
```typescript
// src/lib/mock-auth.ts
export const mockLogin = async (email: string, password: string) => {
  // Mock validation
  if (email === 'demo@pome.com' && password === 'password123') {
    return { success: true, user: mockUser };
  }
  return { success: false, error: 'Invalid credentials' };
};
```

### Future Implementation (NextAuth.js)
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user) return null;
        
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );
        
        if (!isValid) return null;
        
        return user;
      }
    })
  ],
  session: { strategy: 'jwt' },
  // ... more config
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## Performance Considerations

### Caching Strategy

**Static Pages (ISR)**:
- Homepage: Revalidate every 1 hour
- Treatment list: Revalidate every 30 minutes
- Clinic list: Revalidate every 30 minutes

**Dynamic Pages**:
- Treatment detail: Revalidate on-demand
- Clinic detail: Revalidate on-demand
- Search results: No cache (always fresh)
- User profile: No cache (user-specific)

### Database Indexing

Ensure these indexes are created:
```prisma
model Treatment {
  // ...
  @@index([name])
  @@index([categories])
}

model Clinic {
  // ...
  @@index([name])
  @@index([location])
  @@index([verified])
}

model ClinicTreatment {
  // ...
  @@index([clinicId])
  @@index([treatmentId])
}

model SavedItem {
  // ...
  @@index([userId])
}
```

---

## Migration Checklist Summary

### Phase 2: Database Integration
- [ ] Set up Neon database
- [ ] Install and configure Prisma
- [ ] Create Prisma schema (models defined above)
- [ ] Generate Prisma Client
- [ ] Create seed script from mock data
- [ ] Implement API routes (placeholders created)
- [ ] Update components to use API calls
- [ ] Test all functionality
- [ ] Optimize queries and add indexes
- [ ] Deploy to Vercel with database connection

### Phase 3: Authentication
- [ ] Install NextAuth.js
- [ ] Configure NextAuth with Prisma adapter
- [ ] Implement user registration
- [ ] Implement password hashing (bcrypt)
- [ ] Add email verification
- [ ] Add password reset
- [ ] Update protected routes to use NextAuth
- [ ] Migrate mock auth to real auth

### Phase 4: Internationalization Expansion
- [ ] Hire professional translators
- [ ] Translate all keys to Korean
- [ ] Translate all keys to Chinese
- [ ] Translate all keys to Japanese
- [ ] Test all languages
- [ ] Add language-specific content (if needed)

### Phase 5: Advanced Features
- [ ] Implement real-time search (Algolia/Meilisearch)
- [ ] Add user reviews and ratings
- [ ] Add clinic booking system
- [ ] Add email notifications (SendGrid/Resend)
- [ ] Add admin dashboard
- [ ] Add analytics (Vercel Analytics/Google Analytics)

---

## Conclusion

Phase 1 has successfully laid the groundwork for Phase 2 database integration. All TypeScript interfaces are compatible with the planned Prisma schema, and the component structure is ready for API integration with minimal refactoring.

The transition from mock data to real database queries will be straightforward:
1. Replace mock data imports with API fetch calls
2. Implement API routes using Prisma Client
3. Test and optimize queries
4. Deploy with environment variables

**Estimated Phase 2 Duration**: 2-3 weeks
**Estimated Phase 3 Duration**: 2-3 weeks
**Estimated Phase 4 Duration**: 3-4 weeks (depends on translation turnaround)
**Estimated Phase 5 Duration**: 4-6 weeks

---

**Document Version**: 1.0  
**Last Updated**: Phase 1 Completion  
**Next Review**: Start of Phase 2
