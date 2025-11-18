# Phase 2: Database Integration - Design Document

## Overview

Phase 2 transforms the Pome application from using mock data to a production-ready database backend. This phase implements Prisma ORM with Neon PostgreSQL, creates type-safe API routes with Zod validation, and provides comprehensive API documentation through OpenAPI/Swagger and Postman collections.

The design maintains the existing API structure from Phase 1 while adding real database persistence, query optimization, filtering capabilities, and proper error handling.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              API Routes (/src/app/api)                │  │
│  │                                                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   Zod        │  │   Prisma     │  │   Error     │ │  │
│  │  │ Validation   │→ │   Client     │→ │  Handling   │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  Neon PostgreSQL │
                  │   (Serverless)   │
                  └──────────────────┘
```

### Technology Stack

- **Database**: Neon PostgreSQL (serverless, auto-scaling)
- **ORM**: Prisma 5.x (type-safe database client)
- **Validation**: Zod (runtime type checking)
- **API Docs**: OpenAPI 3.0 + Swagger UI
- **Testing**: Manual testing with Postman (automated tests in Phase 6)

## Database Schema Design

### Prisma Schema Structure

The schema is defined in `prisma/schema.prisma` and includes 5 main models:

1. **User** - User accounts and preferences
2. **Treatment** - Cosmetic procedures and treatments
3. **Clinic** - Medical facilities offering treatments
4. **ClinicTreatment** - Junction table linking clinics and treatments
5. **SavedItem** - User's saved treatments and clinics


### Complete Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String      @id @default(cuid())
  email          String      @unique
  passwordHash   String?
  name           String?
  language       String      @default("en")
  gender         String?
  ageRange       String?
  skinType       String?
  treatmentGoals Json?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  savedItems     SavedItem[]
}

model Treatment {
  id                String            @id @default(cuid())
  name              String
  slug              String            @unique
  description       String
  icon              String?
  priceMin          Int?
  priceMax          Int?
  currency          String?           @default("KRW")
  duration          String?
  recoveryTime      String?
  risks             String[]
  categories        String[]
  beforeAfterImages Json?
  suitableFor       Json?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  clinicMappings    ClinicTreatment[]

  @@index([name])
  @@index([slug])
}

model Clinic {
  id           String            @id @default(cuid())
  name         String
  slug         String            @unique
  location     String?
  address      String?
  description  String?
  imageUrl     String?
  rating       Float?            @default(0)
  reviewCount  Int?              @default(0)
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

  @@index([name, location])
  @@index([slug])
  @@index([verified])
}

model ClinicTreatment {
  id           String    @id @default(cuid())
  clinic       Clinic    @relation(fields: [clinicId], references: [id])
  clinicId     String
  treatment    Treatment @relation(fields: [treatmentId], references: [id])
  treatmentId  String
  price        Int?
  availability String    @default("available")
  createdAt    DateTime  @default(now())

  @@unique([clinicId, treatmentId])
}

model SavedItem {
  id       String   @id @default(cuid())
  user     User     @relation(fields: [userId], references: [id])
  userId   String
  itemType String
  itemId   String
  notes    String?
  savedAt  DateTime @default(now())

  @@unique([userId, itemType, itemId])
  @@index([userId])
}
```

### Schema Design Decisions

**Primary Keys:**
- Using CUID instead of auto-increment integers for better distribution and security
- CUIDs are URL-safe and don't expose record counts

**Indexes:**
- Added on frequently queried fields (name, slug, location, verified)
- Composite index on Clinic (name, location) for location-based searches
- Index on SavedItem (userId) for fast user-specific queries

**Data Types:**
- JSON fields for flexible data (treatmentGoals, beforeAfterImages, openingHours)
- String arrays for categories, specialties, risks, photos
- Float for rating to support decimal values
- Int for prices (stored in smallest currency unit, e.g., won)

**Relationships:**
- One-to-many: User → SavedItem
- Many-to-many: Clinic ↔ Treatment (via ClinicTreatment junction table)
- ClinicTreatment stores additional data (price, availability)


## Components and Interfaces

### 1. Prisma Client Singleton (`/src/lib/prisma.ts`)

**Purpose**: Provide a single Prisma Client instance across the application

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Features:**
- Singleton pattern prevents connection exhaustion
- Logging enabled in development for debugging
- Reuses connection in development hot-reload

### 2. Zod Validation Schemas (`/src/lib/validations`)

**Purpose**: Validate API request data before database operations

#### Treatment Validation (`/src/lib/validations/treatment.ts`)

```typescript
import { z } from 'zod';

export const treatmentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  categories: z.string().optional(),
  priceMin: z.coerce.number().int().nonnegative().optional(),
  priceMax: z.coerce.number().int().nonnegative().optional(),
});

export const treatmentIdSchema = z.object({
  id: z.string().cuid(),
});

export type TreatmentQuery = z.infer<typeof treatmentQuerySchema>;
export type TreatmentId = z.infer<typeof treatmentIdSchema>;
```

#### Clinic Validation (`/src/lib/validations/clinic.ts`)

```typescript
import { z } from 'zod';

export const clinicQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  location: z.string().optional(),
  verified: z.coerce.boolean().optional(),
  specialties: z.string().optional(),
});

export const clinicIdSchema = z.object({
  id: z.string().cuid(),
});

export type ClinicQuery = z.infer<typeof clinicQuerySchema>;
export type ClinicId = z.infer<typeof clinicIdSchema>;
```

#### Saved Item Validation (`/src/lib/validations/saved.ts`)

```typescript
import { z } from 'zod';

export const createSavedItemSchema = z.object({
  itemType: z.enum(['clinic', 'treatment']),
  itemId: z.string().cuid(),
  notes: z.string().optional(),
});

export const savedItemIdSchema = z.object({
  id: z.string().cuid(),
});

export type CreateSavedItem = z.infer<typeof createSavedItemSchema>;
export type SavedItemId = z.infer<typeof savedItemIdSchema>;
```

#### Search Validation (`/src/lib/validations/search.ts`)

```typescript
import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
```


### 3. API Route Handlers

#### Treatments API (`/src/app/api/treatments/route.ts`)

**GET /api/treatments**
- Returns paginated list of treatments
- Supports filtering by categories and price range
- Returns total count for pagination

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = treatmentQuerySchema.parse(Object.fromEntries(searchParams));
  
  const where: Prisma.TreatmentWhereInput = {};
  
  if (query.categories) {
    where.categories = { hasSome: query.categories.split(',') };
  }
  
  if (query.priceMin !== undefined || query.priceMax !== undefined) {
    where.AND = [
      query.priceMin ? { priceMin: { gte: query.priceMin } } : {},
      query.priceMax ? { priceMax: { lte: query.priceMax } } : {},
    ];
  }
  
  const [treatments, total] = await Promise.all([
    prisma.treatment.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { name: 'asc' },
    }),
    prisma.treatment.count({ where }),
  ]);
  
  return Response.json({
    treatments,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  });
}
```

**GET /api/treatments/[id]**
- Returns single treatment by ID
- Returns 404 if not found

**GET /api/treatments/[id]/clinics**
- Returns clinics offering the treatment
- Includes pricing and availability from ClinicTreatment

#### Clinics API (`/src/app/api/clinics/route.ts`)

**GET /api/clinics**
- Returns paginated list of clinics
- Supports filtering by location, verified status, and specialties

**GET /api/clinics/[id]**
- Returns single clinic by ID
- Includes related treatments

#### Saved Items API (`/src/app/api/saved/route.ts`)

**GET /api/saved**
- Returns user's saved items
- Requires authentication (mock check in Phase 2)
- Populates treatment/clinic data

**POST /api/saved**
- Creates new saved item
- Validates itemType and itemId
- Prevents duplicates

**DELETE /api/saved/[id]**
- Removes saved item
- Verifies ownership

#### Search API (`/src/app/api/search/route.ts`)

**GET /api/search?q=query**
- Searches treatments and clinics
- Uses case-insensitive LIKE queries
- Returns both result types

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { q, limit } = searchQuerySchema.parse(Object.fromEntries(searchParams));
  
  const searchTerm = `%${q}%`;
  
  const [treatments, clinics] = await Promise.all([
    prisma.treatment.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: limit,
    }),
    prisma.clinic.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: limit,
    }),
  ]);
  
  return Response.json({ treatments, clinics, query: q });
}
```


### 4. Error Handling Utility (`/src/lib/api-error.ts`)

**Purpose**: Standardize error responses across all API routes

```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return Response.json(
      { error: error.message, details: error.details },
      { status: error.statusCode }
    );
  }
  
  if (error instanceof z.ZodError) {
    return Response.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }
  
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return Response.json(
        { error: 'Resource already exists' },
        { status: 409 }
      );
    }
    if (error.code === 'P2025') {
      return Response.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }
  }
  
  return Response.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

## Database Seeding Strategy

### Seed Script (`prisma/seed.ts`)

**Purpose**: Populate database with sample data for development and testing

**Approach:**
- Create 5 diverse treatments (Botox, Laser Toning, Rhinoplasty, Facial Peel, Dermal Fillers)
- Create 5 clinics in different Seoul locations
- Link clinics to treatments with pricing
- Create 1 test user account
- Use upsert to handle re-running seed script

**Sample Data Structure:**

```typescript
const treatments = [
  {
    slug: 'botox',
    name: 'Botox',
    description: 'Reduces fine lines and wrinkles...',
    icon: 'syringe',
    priceMin: 200000,
    priceMax: 500000,
    currency: 'KRW',
    duration: '15-30 minutes',
    recoveryTime: 'None',
    risks: ['Bruising', 'Temporary weakness'],
    categories: ['anti-aging', 'wrinkle-reduction'],
  },
  // ... more treatments
];

const clinics = [
  {
    slug: 'eunogo-clinic',
    name: 'Eunogo Clinic',
    location: 'Gangnam',
    address: 'Gangnam-gu, Seoul',
    description: 'Premier dermatology clinic...',
    verified: true,
    rating: 4.8,
    reviewCount: 245,
    specialties: ['dermatology', 'cosmetic-surgery'],
  },
  // ... more clinics
];
```

**Execution:**
```bash
npx prisma db seed
```


## API Documentation

### OpenAPI Specification

**Location**: `/public/openapi.json`

**Structure**:
```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Pome API",
    "version": "2.0.0",
    "description": "API for Pome dermatology treatment discovery platform"
  },
  "servers": [
    {
      "url": "http://localhost:3000/api",
      "description": "Development server"
    }
  ],
  "paths": {
    "/treatments": {
      "get": {
        "summary": "List treatments",
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "schema": { "type": "integer", "default": 1 }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": { "type": "integer", "default": 20, "maximum": 100 }
          },
          {
            "name": "categories",
            "in": "query",
            "schema": { "type": "string" },
            "description": "Comma-separated list of categories"
          },
          {
            "name": "priceMin",
            "in": "query",
            "schema": { "type": "integer" }
          },
          {
            "name": "priceMax",
            "in": "query",
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "treatments": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Treatment" }
                    },
                    "pagination": { "$ref": "#/components/schemas/Pagination" }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Treatment": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "slug": { "type": "string" },
          "description": { "type": "string" },
          "priceMin": { "type": "integer" },
          "priceMax": { "type": "integer" }
        }
      },
      "Pagination": {
        "type": "object",
        "properties": {
          "page": { "type": "integer" },
          "limit": { "type": "integer" },
          "total": { "type": "integer" },
          "totalPages": { "type": "integer" }
        }
      }
    }
  }
}
```

### Swagger UI Page (`/src/app/api/docs/page.tsx`)

**Purpose**: Interactive API documentation

**Implementation**:
- Server Component that renders Swagger UI
- Loads OpenAPI spec from `/public/openapi.json`
- Allows testing endpoints directly in browser
- Styled to match Pome design system

### Postman Collection (`/scripts/postman-collection.json`)

**Structure**:
```json
{
  "info": {
    "name": "Pome API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    }
  ],
  "item": [
    {
      "name": "Treatments",
      "item": [
        {
          "name": "List Treatments",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/treatments?page=1&limit=20",
              "host": ["{{baseUrl}}"],
              "path": ["treatments"],
              "query": [
                { "key": "page", "value": "1" },
                { "key": "limit", "value": "20" }
              ]
            }
          }
        }
      ]
    }
  ]
}
```


## Environment Configuration

### `.env.example`

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/database"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Authentication (Phase 3)
JWT_SECRET="your-secret-key-here-replace-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

### Environment Variable Usage

- **DATABASE_URL**: Used by Prisma Client for queries (pooled connection)
- **DIRECT_URL**: Used by Prisma Migrate for schema changes (direct connection)
- **NEXT_PUBLIC_APP_URL**: Base URL for API calls from frontend
- **JWT_SECRET**: Placeholder for Phase 3 authentication

## Migration Strategy

### Initial Migration

```bash
# Create migration and apply to database
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### Migration Files

Location: `prisma/migrations/`

Structure:
```
prisma/
  migrations/
    20240101000000_init/
      migration.sql
    migration_lock.toml
```

### Future Migrations

When schema changes:
```bash
# Create new migration
npx prisma migrate dev --name add_user_preferences

# Apply to production
npx prisma migrate deploy
```

## Performance Considerations

### Query Optimization

1. **Indexes**: Added on frequently queried fields
2. **Pagination**: Limit result sets to prevent memory issues
3. **Select Fields**: Only fetch needed fields in queries
4. **Connection Pooling**: Neon handles connection pooling automatically

### Caching Strategy (Future)

- Cache frequently accessed data (featured clinics, popular treatments)
- Use Next.js revalidation for static pages
- Consider Redis for session storage in Phase 3

## Testing Strategy

### Manual Testing Approach

1. **Postman Collection**: Test all endpoints with various parameters
2. **Swagger UI**: Interactive testing in browser
3. **Database Inspection**: Use Prisma Studio to verify data

```bash
# Open Prisma Studio
npx prisma studio
```

### Test Scenarios

**Treatments API:**
- List all treatments
- Filter by category
- Filter by price range
- Pagination (page 1, page 2, invalid page)
- Get single treatment
- Get treatment with invalid ID

**Clinics API:**
- List all clinics
- Filter by location
- Filter by verified status
- Get single clinic with treatments

**Search API:**
- Search for treatment name
- Search for clinic name
- Empty search query
- No results found

**Saved Items API:**
- Create saved item
- List saved items
- Delete saved item
- Duplicate saved item (should fail)

## Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "details": {
    // Additional error information
  }
}
```

### HTTP Status Codes

- **200**: Success
- **400**: Bad Request (validation error)
- **401**: Unauthorized (Phase 3)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **500**: Internal Server Error

### Prisma Error Handling

Common Prisma errors:
- **P2002**: Unique constraint violation
- **P2025**: Record not found
- **P2003**: Foreign key constraint violation

## Security Considerations

### Phase 2 Security

- Input validation with Zod
- SQL injection prevention (Prisma parameterized queries)
- Environment variables for secrets
- HTTPS in production (Vercel handles this)

### Phase 3 Security (Upcoming)

- JWT authentication
- Password hashing with bcrypt
- CSRF protection
- Rate limiting

## Deployment Considerations

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Vercel automatically runs build and deploy

### Database Migrations in Production

```bash
# In package.json
"scripts": {
  "build": "prisma generate && prisma migrate deploy && next build"
}
```

Vercel will run migrations during build process.

## Phase 2 Deliverables

### Completed Features
✅ Prisma schema with 5 models
✅ Database migrations
✅ Seed script with sample data
✅ Prisma Client singleton
✅ Zod validation schemas
✅ All API routes with Prisma queries
✅ Filtering and pagination
✅ Error handling
✅ OpenAPI specification
✅ Swagger UI documentation
✅ Postman collection
✅ Environment configuration
✅ README documentation

### Not Included in Phase 2
❌ Real authentication (Phase 3)
❌ Automated API tests (Phase 6)
❌ Full-text search with tsvector (Phase 4)
❌ Rate limiting (Phase 6)
❌ Caching layer (Phase 6)
❌ Admin interface (Phase 6)

### Preparation for Phase 3
- JWT_SECRET in environment variables
- User model with passwordHash field
- Mock authentication check in saved items API
- API routes ready for authentication middleware

## Conclusion

Phase 2 establishes a solid database foundation for the Pome application. The Prisma schema is type-safe, well-indexed, and ready for production. API routes are validated, documented, and easy to test. The seed script provides realistic data for development, and the OpenAPI/Swagger documentation makes the API accessible to all developers.

With Phase 2 complete, the application is ready for Phase 3 (authentication) and Phase 4 (advanced search), building on this robust database layer.
