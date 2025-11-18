# Phase 2: Database Integration - Requirements Document

## Introduction

This document outlines the requirements for Phase 2 of the Pome web application, which focuses on replacing mock data with a real PostgreSQL database hosted on Neon. This phase will implement Prisma ORM, create database migrations, seed the database with sample data, and update all API routes to use Prisma queries with Zod validation. The phase also includes API documentation via OpenAPI/Swagger and a Postman collection for manual testing.

## Glossary

- **Neon**: Serverless PostgreSQL database platform with automatic scaling
- **Prisma**: TypeScript-first ORM for Node.js and TypeScript
- **Prisma Schema**: Database schema definition file that generates TypeScript types and database migrations
- **Prisma Client**: Auto-generated, type-safe database client
- **Migration**: Version-controlled database schema changes
- **Seed Script**: Script that populates the database with initial data
- **Zod**: TypeScript-first schema validation library
- **OpenAPI**: Standard specification for describing REST APIs
- **Swagger UI**: Interactive API documentation interface
- **Postman Collection**: Exportable collection of API requests for testing
- **CUID**: Collision-resistant unique identifier used for database primary keys
- **Query Parameter**: URL parameter used for filtering, sorting, or pagination (e.g., `?verified=true`)

## Requirements

### Requirement 1: Prisma Setup and Configuration

**User Story:** As a developer, I want to set up Prisma with Neon PostgreSQL, so that the application can store and retrieve data from a real database.

#### Acceptance Criteria

1. THE Pome App SHALL install Prisma and @prisma/client as dependencies
2. THE Pome App SHALL create a Prisma schema file at `prisma/schema.prisma` with PostgreSQL as the datasource
3. THE Pome App SHALL configure the database connection using `DATABASE_URL` environment variable
4. THE Pome App SHALL generate Prisma Client after schema changes
5. THE Pome App SHALL create a `.env.example` file with placeholder database credentials

### Requirement 2: Database Schema Definition

**User Story:** As a developer, I want a Prisma schema that matches Phase 1 TypeScript types, so that database models align with the existing application structure.

#### Acceptance Criteria

1. THE Pome App SHALL define a User model with fields: id, email, passwordHash, name, language, gender, ageRange, skinType, treatmentGoals, createdAt, updatedAt
2. THE Pome App SHALL define a Treatment model with fields: id, name, slug, description, icon, priceMin, priceMax, currency, duration, recoveryTime, risks, categories, beforeAfterImages, suitableFor, createdAt, updatedAt
3. THE Pome App SHALL define a Clinic model with fields: id, name, slug, location, address, description, imageUrl, rating, reviewCount, specialties, kakaoMapLink, verified, priceLevel, openingHours, phoneNumber, websiteUrl, photos, createdAt, updatedAt
4. THE Pome App SHALL define a ClinicTreatment junction model with fields: id, clinicId, treatmentId, price, availability, createdAt
5. THE Pome App SHALL define a SavedItem model with fields: id, userId, itemType, itemId, notes, savedAt
6. THE Pome App SHALL use CUID for all primary keys
7. THE Pome App SHALL add unique constraints on email (User), slug (Treatment, Clinic), and clinicId+treatmentId (ClinicTreatment)
8. THE Pome App SHALL add indexes on frequently queried fields (name, location, slug, verified)

### Requirement 3: Database Migrations

**User Story:** As a developer, I want to create and run database migrations, so that the database schema is version-controlled and reproducible.

#### Acceptance Criteria

1. WHEN a developer runs `prisma migrate dev`, THE Pome App SHALL create migration files in `prisma/migrations`
2. THE Pome App SHALL apply migrations to the Neon database
3. THE Pome App SHALL generate Prisma Client after successful migration
4. THE Pome App SHALL create an initial migration named "init" for the base schema
5. THE Pome App SHALL store migration history in the database

### Requirement 4: Database Seeding

**User Story:** As a developer, I want to seed the database with sample data, so that I can test the application with realistic content.

#### Acceptance Criteria

1. THE Pome App SHALL create a seed script at `prisma/seed.ts`
2. THE Pome App SHALL seed at least 5 treatments with realistic data
3. THE Pome App SHALL seed at least 5 clinics with realistic data
4. THE Pome App SHALL create clinic-treatment relationships for seeded data
5. THE Pome App SHALL create at least 1 test user account
6. WHEN a developer runs `prisma db seed`, THE Pome App SHALL populate the database with seed data
7. THE Pome App SHALL handle duplicate entries gracefully (upsert instead of insert)

### Requirement 5: Prisma Client Integration

**User Story:** As a developer, I want to use Prisma Client in API routes, so that I can perform type-safe database queries.

#### Acceptance Criteria

1. THE Pome App SHALL create a Prisma Client singleton instance in `/src/lib/prisma.ts`
2. THE Pome App SHALL export the Prisma Client for use in API routes
3. THE Pome App SHALL handle Prisma Client connection errors gracefully
4. THE Pome App SHALL close Prisma Client connections properly in development
5. THE Pome App SHALL use Prisma Client in all API route handlers

### Requirement 6: Zod Validation Schemas

**User Story:** As a developer, I want to validate API request data with Zod, so that invalid data is rejected before reaching the database.

#### Acceptance Criteria

1. THE Pome App SHALL create Zod schemas in `/src/lib/validations` for all API request bodies
2. THE Pome App SHALL validate treatment creation/update requests
3. THE Pome App SHALL validate clinic creation/update requests
4. THE Pome App SHALL validate saved item creation requests
5. THE Pome App SHALL validate query parameters for filtering and pagination
6. WHEN validation fails, THE Pome App SHALL return a 400 Bad Request response with detailed error messages
7. THE Pome App SHALL use Zod's type inference to ensure TypeScript type safety

### Requirement 7: Treatments API with Prisma

**User Story:** As a frontend developer, I want to fetch treatments from the database via API, so that users can browse real treatment data.

#### Acceptance Criteria

1. THE Pome App SHALL implement GET `/api/treatments` to return all treatments with pagination
2. THE Pome App SHALL implement GET `/api/treatments/[id]` to return a single treatment by ID
3. THE Pome App SHALL implement GET `/api/treatments/[id]/clinics` to return clinics offering a specific treatment
4. THE Pome App SHALL support filtering by categories via query parameter (e.g., `?categories=skin-rejuvenation`)
5. THE Pome App SHALL support filtering by price range via query parameters (e.g., `?priceMin=100000&priceMax=500000`)
6. THE Pome App SHALL support pagination via query parameters (e.g., `?page=1&limit=20`)
7. THE Pome App SHALL return 404 Not Found when a treatment ID does not exist
8. THE Pome App SHALL return proper error responses for invalid query parameters

### Requirement 8: Clinics API with Prisma

**User Story:** As a frontend developer, I want to fetch clinics from the database via API, so that users can browse real clinic data.

#### Acceptance Criteria

1. THE Pome App SHALL implement GET `/api/clinics` to return all clinics with pagination
2. THE Pome App SHALL implement GET `/api/clinics/[id]` to return a single clinic by ID
3. THE Pome App SHALL support filtering by location via query parameter (e.g., `?location=Gangnam`)
4. THE Pome App SHALL support filtering by verified status via query parameter (e.g., `?verified=true`)
5. THE Pome App SHALL support filtering by specialties via query parameter (e.g., `?specialties=dermatology`)
6. THE Pome App SHALL support pagination via query parameters (e.g., `?page=1&limit=20`)
7. THE Pome App SHALL return 404 Not Found when a clinic ID does not exist
8. THE Pome App SHALL include treatment relationships when fetching clinic details

### Requirement 9: Saved Items API with Prisma

**User Story:** As a logged-in user, I want to save and retrieve my favorite treatments and clinics via API, so that I can access them later.

#### Acceptance Criteria

1. THE Pome App SHALL implement GET `/api/saved` to return all saved items for the authenticated user
2. THE Pome App SHALL implement POST `/api/saved` to create a new saved item
3. THE Pome App SHALL implement DELETE `/api/saved/[id]` to remove a saved item
4. THE Pome App SHALL validate that itemType is either "clinic" or "treatment"
5. THE Pome App SHALL prevent duplicate saved items for the same user and item
6. THE Pome App SHALL return 401 Unauthorized if user is not authenticated (mock check for Phase 2)
7. THE Pome App SHALL return saved items with populated treatment or clinic data

### Requirement 10: Search API with Prisma

**User Story:** As a user, I want to search for treatments and clinics via API, so that I can find relevant results quickly.

#### Acceptance Criteria

1. THE Pome App SHALL implement GET `/api/search` with a query parameter (e.g., `?q=botox`)
2. THE Pome App SHALL search treatment names and descriptions using case-insensitive LIKE queries
3. THE Pome App SHALL search clinic names and descriptions using case-insensitive LIKE queries
4. THE Pome App SHALL return both treatments and clinics in the search results
5. THE Pome App SHALL limit search results to 20 items per category
6. THE Pome App SHALL return an empty array when no results are found
7. THE Pome App SHALL return 400 Bad Request if the query parameter is missing or empty

### Requirement 11: Error Handling in API Routes

**User Story:** As a frontend developer, I want consistent error responses from the API, so that I can handle errors predictably in the UI.

#### Acceptance Criteria

1. THE Pome App SHALL return 400 Bad Request for validation errors with detailed error messages
2. THE Pome App SHALL return 404 Not Found when a resource does not exist
3. THE Pome App SHALL return 500 Internal Server Error for unexpected database errors
4. THE Pome App SHALL log error details to the console for debugging
5. THE Pome App SHALL return error responses in JSON format with `error` and `message` fields
6. THE Pome App SHALL handle Prisma-specific errors (e.g., unique constraint violations)

### Requirement 12: OpenAPI Specification

**User Story:** As a developer, I want an OpenAPI specification for the API, so that I can understand and test endpoints easily.

#### Acceptance Criteria

1. THE Pome App SHALL generate an OpenAPI 3.0 specification file
2. THE Pome App SHALL document all API endpoints with request/response schemas
3. THE Pome App SHALL include query parameter documentation for filtering and pagination
4. THE Pome App SHALL include error response schemas (400, 404, 500)
5. THE Pome App SHALL serve the OpenAPI spec at `/api/openapi.json`
6. THE Pome App SHALL include example requests and responses in the specification

### Requirement 13: Swagger UI Documentation

**User Story:** As a developer, I want interactive API documentation, so that I can test endpoints directly in the browser.

#### Acceptance Criteria

1. THE Pome App SHALL create a Swagger UI page at `/api/docs`
2. THE Pome App SHALL load the OpenAPI specification in Swagger UI
3. THE Pome App SHALL allow developers to test API endpoints directly from the UI
4. THE Pome App SHALL display request/response schemas and examples
5. THE Pome App SHALL support authentication headers in Swagger UI (for Phase 3 preparation)

### Requirement 14: Postman Collection

**User Story:** As a developer, I want a Postman collection for the API, so that I can quickly test endpoints manually.

#### Acceptance Criteria

1. THE Pome App SHALL create a Postman collection JSON file at `/scripts/postman-collection.json`
2. THE Pome App SHALL include all API endpoints in the collection
3. THE Pome App SHALL include example requests with query parameters
4. THE Pome App SHALL organize requests by resource (Treatments, Clinics, Saved Items, Search)
5. THE Pome App SHALL include environment variables for base URL

### Requirement 15: Environment Configuration

**User Story:** As a developer, I want clear environment variable documentation, so that I can configure the application correctly.

#### Acceptance Criteria

1. THE Pome App SHALL create a `.env.example` file with all required environment variables
2. THE Pome App SHALL document DATABASE_URL for Neon connection
3. THE Pome App SHALL document DIRECT_URL for Prisma migrations
4. THE Pome App SHALL document NEXT_PUBLIC_APP_URL for API base URL
5. THE Pome App SHALL document JWT_SECRET placeholder (for Phase 3)
6. THE Pome App SHALL add `.env` to `.gitignore` to prevent committing secrets

### Requirement 16: API Documentation in README

**User Story:** As a developer, I want API documentation in the README, so that I can quickly understand how to use the API.

#### Acceptance Criteria

1. THE Pome App SHALL add a "Phase 2: Database & API" section to README.md
2. THE Pome App SHALL document how to set up the database (Neon connection, migrations, seeding)
3. THE Pome App SHALL list all API endpoints with descriptions
4. THE Pome App SHALL document query parameters for filtering and pagination
5. THE Pome App SHALL provide links to Swagger UI and Postman collection
6. THE Pome App SHALL include example API requests and responses

### Requirement 17: Database Connection Management

**User Story:** As a developer, I want proper database connection management, so that the application doesn't leak connections or crash.

#### Acceptance Criteria

1. THE Pome App SHALL use a singleton pattern for Prisma Client in development
2. THE Pome App SHALL reuse Prisma Client connections across requests
3. THE Pome App SHALL handle connection errors gracefully with retry logic
4. THE Pome App SHALL close database connections properly on application shutdown
5. THE Pome App SHALL log connection status for debugging

### Requirement 18: Type Safety Between Prisma and Application

**User Story:** As a developer, I want TypeScript types to be consistent between Prisma models and application code, so that I can catch type errors at compile time.

#### Acceptance Criteria

1. THE Pome App SHALL use Prisma-generated types in API route handlers
2. THE Pome App SHALL update existing TypeScript interfaces in `/src/types` to match Prisma models
3. THE Pome App SHALL use Prisma types for function parameters and return values
4. THE Pome App SHALL ensure no `any` types are used in database-related code
5. THE Pome App SHALL use Prisma's type utilities (e.g., `Prisma.TreatmentCreateInput`)

### Requirement 19: Pagination Implementation

**User Story:** As a frontend developer, I want paginated API responses, so that I can load large datasets efficiently.

#### Acceptance Criteria

1. THE Pome App SHALL support `page` and `limit` query parameters on list endpoints
2. THE Pome App SHALL default to page 1 and limit 20 if not specified
3. THE Pome App SHALL return pagination metadata (total count, current page, total pages)
4. THE Pome App SHALL validate that page and limit are positive integers
5. THE Pome App SHALL limit maximum page size to 100 items

### Requirement 20: Filtering Implementation

**User Story:** As a user, I want to filter treatments and clinics via API, so that I can find exactly what I'm looking for.

#### Acceptance Criteria

1. THE Pome App SHALL support filtering treatments by categories (array of strings)
2. THE Pome App SHALL support filtering treatments by price range (priceMin, priceMax)
3. THE Pome App SHALL support filtering clinics by location (string)
4. THE Pome App SHALL support filtering clinics by verified status (boolean)
5. THE Pome App SHALL support filtering clinics by specialties (array of strings)
6. THE Pome App SHALL combine multiple filters with AND logic
7. THE Pome App SHALL validate filter parameters with Zod
