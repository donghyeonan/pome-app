# Implementation Plan
 
- [x] 1.1 Install required dependencies
  - Install Prisma and Prisma Client: `npm install prisma @prisma/client`
  - Install Zod for validation: `npm install zod`
  - Install Swagger UI: `npm install swagger-ui-react`
  - Install dev dependencies: `npm install -D @types/swagger-ui-react`
  - _Requirements: 1.1, 6.1_

- [x] 1.2 Create environment configuration
  - Create `.env.example` with DATABASE_URL, DIRECT_URL, SHADOW_DATABASE_URL, NEXT_PUBLIC_APP_URL, JWT_SECRET placeholders
  - Add `.env` to `.gitignore` if not already present
  - Document environment variables in comments
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

- [x] 1.3 Initialize Prisma
  - Run `npx prisma init` to create prisma folder
  - Configure datasource to use DATABASE_URL from environment
  - _Requirements: 1.2, 1.3_

- [x] 2.1 Create SavedItemType enum
  - Define enum with 'clinic' and 'treatment' values
  - _Requirements: 2.8_

- [x] 2.2 Define User model
  - Add fields: id (cuid), email (unique), passwordHash, name, language, gender, ageRange, skinType, treatmentGoals
  - Add timestamps: createdAt, updatedAt
  - Add relation to SavedItem
  - _Requirements: 2.1_

- [x] 2.3 Define Treatment model
  - Add fields: id (cuid), name, slug (unique), description, icon, priceMin, priceMax, currency, duration, recoveryTime, risks (array), categories (array), beforeAfterImages (JSON), suitableFor (JSON)
  - Add timestamps: createdAt, updatedAt
  - Add relation to ClinicTreatment
  - Add indexes on name and slug
  - _Requirements: 2.2, 2.8_

- [x] 2.4 Define Clinic model
  - Add fields: id (cuid), name, slug (unique), location, address, description, imageUrl, rating, reviewCount, specialties (array), kakaoMapLink, verified, priceLevel, openingHours (JSON), phoneNumber, websiteUrl, photos (array)
  - Add timestamps: createdAt, updatedAt
  - Add relation to ClinicTreatment
  - Add indexes on name, location, slug, and verified
  - _Requirements: 2.3, 2.8_

- [x] 2.5 Define ClinicTreatment junction model
  - Add fields: id (cuid), clinicId, treatmentId, price, availability
  - Add timestamp: createdAt
  - Add relations to Clinic and Treatment
  - Add unique constraint on [clinicId, treatmentId]
  - _Requirements: 2.4, 2.8_

- [x] 2.6 Define SavedItem model
  - Add fields: id (cuid), userId, itemType (SavedItemType enum), itemId, notes
  - Add timestamp: savedAt
  - Add relation to User
  - Add unique constraint on [userId, itemType, itemId]
  - Add index on userId
  - _Requirements: 2.5, 2.8_

- [x] 3.1 Create initial migration
  - Run `npx prisma migrate dev --name init` to create migration files
  - Verify migration SQL in prisma/migrations folder
  - Ensure migration applies successfully to Neon database
  - _Requirements: 3.1, 3.2, 3.4_

- [x] 3.2 Generate Prisma Client
  - Run `npx prisma generate` to create type-safe client
  - Verify @prisma/client types are generated
  - _Requirements: 3.3, 5.2_

- [x] 3.3 Add migration script to package.json
  - Add script: `"db:migrate": "prisma migrate dev"`
  - Add script: `"db:generate": "prisma generate"`
  - Add script: `"db:studio": "prisma studio"`
  - _Requirements: 3.1, 3.2_

- [x] 4.1 Create Prisma Client singleton
  - Create `/src/lib/prisma.ts`
  - Implement singleton pattern to prevent connection exhaustion
  - Configure logging: query/error/warn in development, error only in production
  - Handle hot-reload in development
  - Export prisma instance
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 17.1, 17.2_

- [x] 5.1 Create seed script structure
  - Create `prisma/seed.ts` file
  - Import Prisma Client
  - Create main seed function
  - Add error handling and logging
  - _Requirements: 4.1, 4.7_

- [x] 5.2 Seed treatments data
  - Create 3 treatments: Botox, Laser Toning, Rhinoplasty
  - Include realistic data: name, slug, description, icon, categories, priceMin, priceMax, currency (KRW)
  - Use upsert to handle re-running seed
  - _Requirements: 4.2, 4.7_

- [x] 5.3 Seed clinics data
  - Create 3 clinics with English names in Gangnam, Apgujeong, Itaewon
  - Include: name, slug, location, address, description, rating, verified status, specialties
  - Use realistic Korean addresses
  - Use upsert to handle re-running seed
  - _Requirements: 4.3, 4.7_

- [x] 5.4 Seed test user
  - Create user with email: test@pome.com, password: password123 (hashed)
  - Include basic profile data
  - Use upsert to handle re-running seed
  - _Requirements: 4.5_

- [x] 5.5 Seed clinic-treatment relationships
  - Link Gangnam clinic to Botox and Laser Toning
  - Link Apgujeong clinic to Rhinoplasty
  - Link Itaewon clinic to Botox
  - Include price and availability data
  - _Requirements: 4.4_

- [x] 5.6 Configure seed command
  - Add `"prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }` to package.json
  - Add script: `"db:seed": "prisma db seed"`
  - Test seed command
  - _Requirements: 4.6_

- [x] 6.1 Create standardized response helper
  - Create `/src/lib/api-response.ts`
  - Implement `apiSuccess<T>(data: T, pagination?: PaginationMeta)` function
  - Implement `apiError(code: string, message: string, status?: number)` function
  - Return Response objects with proper JSON and status codes
  - _Requirements: 11.5, 19.3_

- [x] 6.2 Create error handling utility
  - Create `/src/lib/api-error.ts`
  - Create ApiError class with statusCode and details
  - Implement handleApiError function for centralized error handling
  - Handle Zod validation errors (return 400 with details)
  - Handle Prisma errors (P2002 unique constraint, P2025 not found)
  - Handle generic errors (return 500)
  - Log errors to console
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [x] 7.1 Create pagination schema
  - Create `/src/lib/validations/pagination.ts`
  - Define schema with page (default 1), limit (default 20, max 100)
  - Use z.coerce for number conversion
  - Export TypeScript type
  - _Requirements: 6.1, 6.5, 19.1, 19.2, 19.4_

- [x] 7.2 Create treatment validation schemas
  - Create `/src/lib/validations/treatment.ts`
  - Define treatmentQuerySchema with pagination, categories, priceMin, priceMax
  - Define treatmentIdSchema for route params
  - Export TypeScript types
  - _Requirements: 6.2, 6.5, 7.1, 7.2, 20.1, 20.2, 20.7_

- [x] 7.3 Create clinic validation schemas
  - Create `/src/lib/validations/clinic.ts`
  - Define clinicQuerySchema with pagination, location, verified, specialties
  - Define clinicIdSchema for route params
  - Export TypeScript types
  - _Requirements: 6.2, 6.5, 8.1, 8.2, 20.3, 20.4, 20.5, 20.7_

- [x] 7.4 Create saved item validation schemas
  - Create `/src/lib/validations/saved.ts`
  - Define createSavedItemSchema with itemType enum, itemId, notes
  - Define savedItemIdSchema for route params
  - Export TypeScript types
  - _Requirements: 6.2, 6.5, 9.4_

- [x] 7.5 Create search validation schema
  - Create `/src/lib/validations/search.ts`
  - Define searchQuerySchema with q (min 1, max 100), limit
  - Export TypeScript type
  - _Requirements: 6.2, 6.5, 10.7_

- [x] 7.6 Create validation index file
  - Create `/src/lib/validations/index.ts`
  - Export all validation schemas and types
  - _Requirements: 6.1_

- [x] 8.1 Implement GET /api/treatments
  - Create `/src/app/api/treatments/route.ts`
  - Parse and validate query parameters with Zod
  - Build Prisma where clause for filters (categories, priceMin, priceMax)
  - Query treatments with pagination (skip, take)
  - Query total count for pagination metadata
  - Return success response with treatments and pagination
  - Handle errors with centralized error handler
  - _Requirements: 7.1, 7.4, 7.5, 7.6, 7.8, 19.1, 19.3, 20.1, 20.2, 20.6, 20.7_

- [x] 8.2 Implement GET /api/treatments/[id]
  - Create `/src/app/api/treatments/[id]/route.ts`
  - Validate id parameter with Zod
  - Query single treatment by id using Prisma
  - Return 404 if treatment not found
  - Return success response with treatment data
  - Handle errors with centralized error handler
  - _Requirements: 7.2, 7.7, 18.2_

- [x] 8.3 Implement GET /api/treatments/[id]/clinics
  - Create `/src/app/api/treatments/[id]/clinics/route.ts`
  - Validate id parameter with Zod
  - Query clinics offering the treatment via ClinicTreatment junction
  - Include price and availability from junction table
  - Return success response with clinics array
  - Handle errors with centralized error handler
  - _Requirements: 7.3, 18.2_

- [x] 9.1 Implement GET /api/clinics
  - Create `/src/app/api/clinics/route.ts`
  - Parse and validate query parameters with Zod
  - Build Prisma where clause for filters (location, verified, specialties)
  - Query clinics with pagination (skip, take)
  - Query total count for pagination metadata
  - Return success response with clinics and pagination
  - Handle errors with centralized error handler
  - _Requirements: 8.1, 8.4, 8.5, 8.6, 8.7, 19.1, 19.3, 20.3, 20.4, 20.5, 20.6, 20.7_

- [x] 9.2 Implement GET /api/clinics/[id]
  - Create `/src/app/api/clinics/[id]/route.ts`
  - Validate id parameter with Zod
  - Query single clinic by id using Prisma
  - Include related treatments via ClinicTreatment junction
  - Return 404 if clinic not found
  - Return success response with clinic data and treatments
  - Handle errors with centralized error handler
  - _Requirements: 8.2, 8.3, 8.8, 18.2_

- [x] 10.1 Implement GET /api/search
  - Create `/src/app/api/search/route.ts`
  - Parse and validate query parameter with Zod
  - Search treatments using case-insensitive LIKE (contains mode)
  - Search clinics using case-insensitive LIKE (contains mode)
  - Limit results to specified limit (default 20)
  - Return success response with treatments and clinics arrays
  - Return empty arrays if no results found
  - Handle errors with centralized error handler
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [x] 11.1 Implement GET /api/saved
  - Create `/src/app/api/saved/route.ts`
  - Use mock userId: "test-user" (Phase 2 only)
  - Query saved items for user
  - Include populated treatment or clinic data based on itemType
  - Return success response with saved items array
  - Handle errors with centralized error handler
  - _Requirements: 9.1, 9.6, 9.7_

- [x] 11.2 Implement POST /api/saved
  - Add POST handler to `/src/app/api/saved/route.ts`
  - Parse and validate request body with Zod
  - Use mock userId: "test-user" (Phase 2 only)
  - Create saved item with Prisma
  - Handle duplicate entries (unique constraint)
  - Return success response with created saved item
  - Handle errors with centralized error handler
  - _Requirements: 9.2, 9.4, 9.5_

- [x] 11.3 Implement DELETE /api/saved/[id]
  - Create `/src/app/api/saved/[id]/route.ts`
  - Validate id parameter with Zod
  - Delete saved item by id using Prisma
  - Return 404 if saved item not found
  - Return success response
  - Handle errors with centralized error handler
  - _Requirements: 9.3_

- [x] 12.1 Create OpenAPI spec structure
  - Create `/public/openapi.json`
  - Define OpenAPI 3.0 metadata (title, version, description)
  - Define server URL (localhost:3000/api)
  - Create tags: Treatments, Clinics, Search, Saved Items
  - _Requirements: 12.1, 12.2_

- [x]* 12.2 Document Treatments endpoints
  - Add GET /api/treatments with query parameters
  - Add GET /api/treatments/{id}
  - Add GET /api/treatments/{id}/clinics
  - Include request schemas, response schemas, examples
  - _Requirements: 12.2, 12.3, 12.6_

- [x]* 12.3 Document Clinics endpoints
  - Add GET /api/clinics with query parameters
  - Add GET /api/clinics/{id}
  - Include request schemas, response schemas, examples
  - _Requirements: 12.2, 12.3, 12.6_

- [x]* 12.4 Document Search endpoint
  - Add GET /api/search with query parameter
  - Include request schema, response schema, examples
  - _Requirements: 12.2, 12.3, 12.6_

- [x]* 12.5 Document Saved Items endpoints
  - Add GET /api/saved
  - Add POST /api/saved with request body
  - Add DELETE /api/saved/{id}
  - Include request schemas, response schemas, examples
  - _Requirements: 12.2, 12.3, 12.6_

- [x]* 12.6 Add error response schemas
  - Define error response schema (code, message)
  - Add 400, 404, 500 error examples to all endpoints
  - _Requirements: 12.4_

- [x]* 12.7 Add component schemas
  - Define Treatment, Clinic, SavedItem, Pagination schemas
  - Reference schemas in endpoint responses
  - _Requirements: 12.2_

- [x] 13.1 Create Swagger UI page
  - Create `/src/app/api/docs/page.tsx`
  - Mark as Client Component with 'use client'
  - Import SwaggerUI from swagger-ui-react
  - Import swagger-ui-react CSS
  - Configure SwaggerUI to load /openapi.json
  - Add page title and container styling
  - _Requirements: 13.1, 13.2, 13.3_

- [x] 13.2 Test Swagger UI
  - Visit http://localhost:3000/api/docs
  - Verify all endpoints are displayed
  - Test "Try it out" functionality for each endpoint
  - Verify request/response schemas are shown
  - _Requirements: 13.3, 13.4, 13.5_

- [x]* 14.1 Create Postman collection structure
  - Create `/scripts/postman-collection.json`
  - Define collection metadata (name, version)
  - Add environment variable: {{baseUrl}} = http://localhost:3000/api
  - _Requirements: 14.1, 14.5_

- [x]* 14.2 Add Treatments requests
  - Add GET List Treatments with query params
  - Add GET Single Treatment
  - Add GET Treatment Clinics
  - _Requirements: 14.2, 14.3_

- [x]* 14.3 Add Clinics requests
  - Add GET List Clinics with query params
  - Add GET Single Clinic
  - _Requirements: 14.2, 14.3_

- [x]* 14.4 Add Search request
  - Add GET Search with query param
  - _Requirements: 14.2, 14.3_

- [x]* 14.5 Add Saved Items requests
  - Add GET List Saved Items
  - Add POST Create Saved Item with body
  - Add DELETE Remove Saved Item
  - _Requirements: 14.2, 14.3_

- [x]* 14.6 Organize collection
  - Group requests by resource (Treatments, Clinics, Search, Saved Items)
  - Add descriptions to each request
  - _Requirements: 14.4_

- [x]* 15.1 Update README with Phase 2 section
  - Add "Phase 2: Database & API" heading
  - Document Neon database setup
  - Document environment variables
  - _Requirements: 16.1, 16.2_

- [x]* 15.2 Document database setup
  - Add instructions for creating .env file
  - Add instructions for running migrations: `npm run db:migrate`
  - Add instructions for seeding: `npm run db:seed`
  - Add instructions for Prisma Studio: `npm run db:studio`
  - _Requirements: 16.2_

- [x]* 15.3 Document API endpoints
  - List all endpoints with descriptions
  - Document query parameters for each endpoint
  - Provide example requests and responses
  - _Requirements: 16.3, 16.4_

- [x]* 15.4 Add API testing documentation
  - Document Swagger UI URL: http://localhost:3000/api/docs
  - Document how to import Postman collection
  - Add tips for testing with Swagger UI
  - _Requirements: 16.5_

- [x]* 15.5 Update .env.example
  - Ensure all environment variables are documented
  - Add comments explaining each variable
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 16.1 Test Treatments API
  - Test GET /api/treatments without filters
  - Test GET /api/treatments with category filter
  - Test GET /api/treatments with price range filter
  - Test GET /api/treatments with pagination
  - Test GET /api/treatments/[id] with valid ID
  - Test GET /api/treatments/[id] with invalid ID (should return 404)
  - Test GET /api/treatments/[id]/clinics
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_

- [ ] 16.2 Test Clinics API
  - Test GET /api/clinics without filters
  - Test GET /api/clinics with location filter
  - Test GET /api/clinics with verified filter
  - Test GET /api/clinics with specialties filter
  - Test GET /api/clinics with pagination
  - Test GET /api/clinics/[id] with valid ID
  - Test GET /api/clinics/[id] with invalid ID (should return 404)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 16.3 Test Search API
  - Test GET /api/search with treatment keyword
  - Test GET /api/search with clinic keyword
  - Test GET /api/search with no results
  - Test GET /api/search with empty query (should return 400)
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 16.4 Test Saved Items API
  - Test GET /api/saved
  - Test POST /api/saved with valid data
  - Test POST /api/saved with invalid itemType (should return 400)
  - Test POST /api/saved with duplicate (should handle gracefully)
  - Test DELETE /api/saved/[id] with valid ID
  - Test DELETE /api/saved/[id] with invalid ID (should return 404)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 16.5 Test error handling
  - Verify Zod validation errors return 400 with details
  - Verify not found errors return 404
  - Verify Prisma errors are handled correctly
  - Verify all errors are logged to console
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [ ] 16.6 Test Swagger UI
  - Open http://localhost:3000/api/docs
  - Test each endpoint using "Try it out"
  - Verify responses match expected format
  - Verify error responses are shown correctly
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 16.7 Test Postman collection
  - Import collection into Postman
  - Set baseUrl environment variable
  - Run all requests in collection
  - Verify responses
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 17.1 Update TypeScript types
  - Ensure `/src/types` interfaces match Prisma models
  - Use Prisma-generated types where possible
  - Remove or update mock data types
  - _Requirements: 18.1, 18.2, 18.3, 18.4_

- [x] 17.2 Verify no `any` types
  - Search codebase for `any` types in database-related code
  - Replace with proper Prisma types
  - Run TypeScript compiler to check for errors
  - _Requirements: 18.4_

- [x] 17.3 Test type inference
  - Verify Zod type inference works correctly
  - Verify Prisma type inference works correctly
  - Ensure API route handlers have proper types
  - _Requirements: 6.7, 18.2, 18.5_

- [x] 18.1 Review and optimize Prisma queries
  - Ensure indexes are used effectively
  - Verify no N+1 query problems
  - Check query performance with Prisma Studio
  - _Requirements: 17.1, 17.2, 17.3_

- [x] 18.2 Review error handling
  - Ensure all API routes use centralized error handler
  - Verify error messages are user-friendly
  - Check error logging is working
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 17.5_

- [x] 18.3 Review code organization
  - Ensure consistent file structure
  - Verify imports use @/ alias
  - Check for unused imports
  - _Requirements: 18.1, 18.2_

- [x] 18.4 Run final tests
  - Test all endpoints via Swagger UI
  - Test all endpoints via Postman
  - Verify database has correct seed data
  - Check for any console errors
  - _Requirements: All requirements_
