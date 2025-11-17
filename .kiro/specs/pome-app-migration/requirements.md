# Requirements Document

## Introduction

This document outlines the requirements for migrating the Pome web application from Next.js Pages Router with JavaScript to App Router with TypeScript, and building a full-stack dermatology procedure recommendation and clinic discovery platform. The migration will be executed in 5 phases, with Phase 1 focusing on UI/UX migration while maintaining visual parity with the existing design.

## Glossary

- **Pome App**: A web application that helps users discover dermatology cosmetic procedures and clinics in Korea
- **App Router**: Next.js 13+ routing system using the `/app` directory
- **Pages Router**: Legacy Next.js routing system using the `/pages` directory
- **Treatment**: A dermatology or cosmetic procedure (e.g., Botox, Laser Toning, Rhinoplasty)
- **Clinic**: A medical facility that offers treatments
- **Protected Route**: A page that requires user authentication to access
- **Public Route**: A page accessible without authentication
- **shadcn/ui**: A collection of reusable UI components built with Radix UI and Tailwind CSS
- **Lucide Icons**: Icon library used by shadcn/ui
- **Mock Data**: Static placeholder data used during Phase 1 before database integration
- **Neon**: Serverless PostgreSQL database platform
- **Prisma**: TypeScript ORM for database access
- **NextAuth**: Authentication library for Next.js applications
- **i18n**: Internationalization - the process of designing software to support multiple languages
- **next-intl**: Internationalization library for Next.js applications
- **Translation Key**: A unique identifier used to reference translated text (e.g., 'home.title')

## Requirements

### Requirement 1: Project Structure Migration

**User Story:** As a developer, I want the project to use Next.js App Router with TypeScript, so that the codebase follows modern best practices and is type-safe.

#### Acceptance Criteria

1. WHEN the project is initialized, THE Pome App SHALL use the `/src/app` directory structure for all routes
2. THE Pome App SHALL convert all `.js` and `.jsx` files to `.tsx` format with proper TypeScript types
3. THE Pome App SHALL organize code into the following directory structure: `/src/app`, `/src/components`, `/src/lib`, `/src/hooks`, `/src/types`, and `/src/data`
4. THE Pome App SHALL use TypeScript strict mode for type checking
5. THE Pome App SHALL include proper TypeScript configuration in `tsconfig.json`

### Requirement 2: Visual Design Parity

**User Story:** As a user, I want the migrated application to look and feel identical to the current version, so that my experience remains consistent.

#### Acceptance Criteria

1. THE Pome App SHALL maintain the same color palette as defined in the existing Tailwind configuration (primary: #D90429, background colors, text colors)
2. THE Pome App SHALL preserve the same card layouts, spacing, and border radius values (rounded-2xl, rounded-3xl)
3. THE Pome App SHALL maintain the same typography hierarchy using the Inter font family
4. THE Pome App SHALL support both light and dark mode with the same color schemes
5. THE Pome App SHALL replicate all existing page layouts with 1:1 visual parity

### Requirement 3: Component System with shadcn/ui

**User Story:** As a developer, I want to use shadcn/ui components throughout the application, so that we have consistent, accessible, and maintainable UI components.

#### Acceptance Criteria

1. THE Pome App SHALL initialize shadcn/ui with the existing color scheme and design tokens
2. THE Pome App SHALL use shadcn/ui components for Button, Input, Card, Dialog, Dropdown Menu, Sheet, Navigation Menu, and Tabs
3. THE Pome App SHALL replace all Material Symbols icons with equivalent Lucide icons
4. THE Pome App SHALL create custom components that wrap shadcn/ui primitives when needed for design consistency
5. THE Pome App SHALL maintain minimalist styling with soft shadows and rounded-2xl cards

### Requirement 4: Public Route Access

**User Story:** As a visitor, I want to access the homepage and treatment detail pages without logging in, so that I can explore treatments before creating an account.

#### Acceptance Criteria

1. THE Pome App SHALL render the homepage at `/` without requiring authentication
2. THE Pome App SHALL render treatment detail pages at `/treatments/[id]` without requiring authentication
3. WHEN a visitor accesses a public route, THE Pome App SHALL display full page content without login prompts
4. THE Pome App SHALL display navigation elements that indicate which features require login
5. THE Pome App SHALL allow visitors to view treatment information, descriptions, and details on public pages

### Requirement 5: Protected Route Access Control

**User Story:** As a product owner, I want certain pages to require authentication, so that we can provide personalized features to registered users.

#### Acceptance Criteria

1. THE Pome App SHALL require authentication for the following routes: `/treatments` (list), `/clinics`, `/clinics/[id]`, `/search`, `/saved`, and `/profile`
2. WHEN an unauthenticated user attempts to access a protected route, THE Pome App SHALL redirect to `/login`
3. WHEN a user successfully logs in, THE Pome App SHALL redirect to the originally requested protected route
4. THE Pome App SHALL store the intended destination URL during the authentication redirect flow
5. THE Pome App SHALL display appropriate UI indicators for protected features in navigation elements

### Requirement 6: Homepage Layout and Navigation

**User Story:** As a user, I want the homepage to showcase featured clinics and popular procedures, so that I can quickly discover relevant treatments.

#### Acceptance Criteria

1. THE Pome App SHALL display a hero banner with the tagline "Your Trusted Guide to Beauty in Korea" on the homepage
2. THE Pome App SHALL display a "Featured Clinics" section with horizontally scrollable clinic cards
3. THE Pome App SHALL display a "Popular Procedures" section with a grid of treatment cards
4. WHEN a user clicks "See All" under Featured Clinics, THE Pome App SHALL navigate to `/clinics` (protected route)
5. WHEN a user clicks "See All" under Popular Procedures, THE Pome App SHALL navigate to `/treatments` (protected route)
6. WHEN a user clicks a treatment card, THE Pome App SHALL navigate to `/treatments/[id]` (public route)
7. WHEN a user clicks a clinic card, THE Pome App SHALL navigate to `/clinics/[id]` (protected route)

### Requirement 7: Bottom Navigation Bar

**User Story:** As a mobile user, I want a persistent bottom navigation bar, so that I can easily navigate between main sections of the app.

#### Acceptance Criteria

1. THE Pome App SHALL display a fixed bottom navigation bar on all pages
2. THE Pome App SHALL include navigation tabs for: Home, Procedures, Clinics, Saved, and Profile
3. WHEN a user clicks the Procedures tab, THE Pome App SHALL navigate to `/treatments` (protected)
4. WHEN a user clicks the Clinics tab, THE Pome App SHALL navigate to `/clinics` (protected)
5. WHEN a user clicks the Saved tab, THE Pome App SHALL navigate to `/saved` (protected)
6. WHEN a user clicks the Profile tab, THE Pome App SHALL navigate to `/profile` (protected)
7. THE Pome App SHALL highlight the active tab in the bottom navigation
8. THE Pome App SHALL use Lucide icons for all navigation items

### Requirement 8: Search Interface and Autocomplete

**User Story:** As a user, I want to search for treatments and clinics with autocomplete suggestions, so that I can quickly find what I'm looking for.

#### Acceptance Criteria

1. THE Pome App SHALL display a search input field on the homepage, treatments list, clinics list, and search results pages
2. WHEN a user types in the search field, THE Pome App SHALL display an autocomplete dropdown with treatment matches only
3. THE Pome App SHALL limit autocomplete results to a maximum of 10 treatment suggestions
4. WHEN a user clicks an autocomplete suggestion, THE Pome App SHALL navigate to `/treatments/[id]`
5. WHEN a user presses Enter in the search field, THE Pome App SHALL navigate to `/search` with the query parameter
6. THE Pome App SHALL debounce autocomplete queries by 300 milliseconds to optimize performance

### Requirement 9: Search Results Page Logic

**User Story:** As a user, I want search results to intelligently show treatments and related clinics or just clinics based on my query, so that I get relevant results.

#### Acceptance Criteria

1. WHEN a user searches for a treatment keyword, THE Pome App SHALL display matching treatments in the first section
2. WHEN a user searches for a treatment keyword, THE Pome App SHALL display clinics that offer those treatments in the second section
3. WHEN a user searches for a clinic name, THE Pome App SHALL display only matching clinics
4. THE Pome App SHALL automatically detect search type based on data matches without requiring user-selected tabs
5. WHEN a user clicks a treatment in search results, THE Pome App SHALL navigate to `/treatments/[id]`
6. WHEN a user clicks a clinic in search results, THE Pome App SHALL navigate to `/clinics/[id]` (protected)

### Requirement 10: Treatments List Page

**User Story:** As a logged-in user, I want to browse all available treatments with filtering and sorting options, so that I can find procedures that match my needs.

#### Acceptance Criteria

1. THE Pome App SHALL display a comprehensive list of all treatments at `/treatments`
2. THE Pome App SHALL require authentication to access the treatments list page
3. THE Pome App SHALL provide filter options for treatment categories
4. THE Pome App SHALL provide filter options for price range
5. THE Pome App SHALL provide sorting options (e.g., popularity, price, name)
6. WHEN a user clicks a treatment card, THE Pome App SHALL navigate to `/treatments/[id]`

### Requirement 11: Treatment Detail Page

**User Story:** As a user, I want to view detailed information about a specific treatment, so that I can make informed decisions.

#### Acceptance Criteria

1. THE Pome App SHALL display treatment details at `/treatments/[id]` without requiring authentication
2. THE Pome App SHALL display treatment name, description, icon, price range, duration, and recovery time
3. THE Pome App SHALL display treatment risks and categories
4. THE Pome App SHALL display before/after images if available
5. THE Pome App SHALL display a list of clinics that offer this treatment
6. WHEN a user clicks a clinic in the treatment detail page, THE Pome App SHALL navigate to `/clinics/[id]` (protected)

### Requirement 12: Clinics List Page

**User Story:** As a logged-in user, I want to browse all available clinics with filtering and sorting options, so that I can find reputable providers.

#### Acceptance Criteria

1. THE Pome App SHALL display a comprehensive list of all clinics at `/clinics`
2. THE Pome App SHALL require authentication to access the clinics list page
3. THE Pome App SHALL provide filter options for clinic location
4. THE Pome App SHALL provide filter options for clinic specialties
5. THE Pome App SHALL provide filter options for verified status
6. THE Pome App SHALL provide sorting options (e.g., rating, name, location)
7. WHEN a user clicks a clinic card, THE Pome App SHALL navigate to `/clinics/[id]`

### Requirement 13: Clinic Detail Page

**User Story:** As a logged-in user, I want to view detailed information about a specific clinic, so that I can evaluate their services and reputation.

#### Acceptance Criteria

1. THE Pome App SHALL display clinic details at `/clinics/[id]` with authentication required
2. THE Pome App SHALL display clinic name, location, description, rating, and verification status
3. THE Pome App SHALL display clinic specialties and available treatments
4. THE Pome App SHALL display clinic images
5. THE Pome App SHALL provide a link to the clinic's Kakao Map location
6. THE Pome App SHALL display a list of treatments offered by the clinic
7. WHEN a user clicks a treatment in the clinic detail page, THE Pome App SHALL navigate to `/treatments/[id]`

### Requirement 14: Saved Items Page

**User Story:** As a logged-in user, I want to view my saved clinics and treatments, so that I can easily access items I'm interested in.

#### Acceptance Criteria

1. THE Pome App SHALL display saved items at `/saved` with authentication required
2. THE Pome App SHALL display saved clinics and saved treatments in separate sections
3. WHEN a user has no saved items, THE Pome App SHALL display an empty state with a call-to-action
4. THE Pome App SHALL allow users to remove items from their saved list
5. WHEN a user clicks a saved treatment, THE Pome App SHALL navigate to `/treatments/[id]`
6. WHEN a user clicks a saved clinic, THE Pome App SHALL navigate to `/clinics/[id]`

### Requirement 15: User Profile Page

**User Story:** As a logged-in user, I want to view and manage my profile settings, so that I can personalize my experience.

#### Acceptance Criteria

1. THE Pome App SHALL display user profile at `/profile` with authentication required
2. THE Pome App SHALL display user name and email
3. THE Pome App SHALL provide a language preference selector
4. THE Pome App SHALL provide a logout button
5. WHEN a user clicks logout, THE Pome App SHALL end the session and redirect to the homepage
6. THE Pome App SHALL display user preferences including gender, age range, skin type, and treatment goals (when available)

### Requirement 16: Login Page and Authentication Flow

**User Story:** As a user, I want to log in with my email and password, so that I can access protected features.

#### Acceptance Criteria

1. THE Pome App SHALL display a login form at `/login`
2. THE Pome App SHALL accept email and password inputs
3. WHEN a user submits valid credentials, THE Pome App SHALL create an authenticated session
4. WHEN a user submits invalid credentials, THE Pome App SHALL display an error message
5. WHEN a user successfully logs in, THE Pome App SHALL redirect to the originally requested page or homepage
6. THE Pome App SHALL provide a link to a registration page (for future implementation)

### Requirement 17: Mock Data Implementation (Phase 1)

**User Story:** As a developer, I want to use mock data during Phase 1, so that I can build and test the UI before backend integration.

#### Acceptance Criteria

1. THE Pome App SHALL create mock data files in `/src/data` for treatments, clinics, and users
2. THE Pome App SHALL use TypeScript interfaces to define data structures that match the future Prisma schema
3. THE Pome App SHALL populate all pages with realistic mock data during Phase 1
4. THE Pome App SHALL structure mock data to be easily replaceable with API calls in future phases
5. THE Pome App SHALL include at least 10 mock treatments and 10 mock clinics

### Requirement 18: Responsive Design

**User Story:** As a user on any device, I want the application to be fully responsive, so that I have a great experience on mobile, tablet, and desktop.

#### Acceptance Criteria

1. THE Pome App SHALL implement mobile-first responsive design
2. THE Pome App SHALL display the bottom navigation bar on mobile and tablet viewports
3. THE Pome App SHALL adapt card layouts for different screen sizes (single column on mobile, grid on desktop)
4. THE Pome App SHALL ensure all interactive elements are touch-friendly on mobile devices
5. THE Pome App SHALL maintain visual hierarchy and readability across all viewport sizes

### Requirement 19: Database Schema Design (Phase 2 Preparation)

**User Story:** As a developer, I want TypeScript interfaces that match the future database schema, so that Phase 2 integration is seamless.

#### Acceptance Criteria

1. THE Pome App SHALL define TypeScript interfaces for User, Treatment, Clinic, ClinicTreatment, and SavedItem entities
2. THE Pome App SHALL include all fields specified in the Prisma schema requirements (id, email, password_hash, name, etc.)
3. THE Pome App SHALL use these interfaces for all mock data and component props
4. THE Pome App SHALL structure interfaces to match Prisma model relationships
5. THE Pome App SHALL export all type definitions from `/src/types`

### Requirement 20: Technology Stack

**User Story:** As a developer, I want to use modern, production-ready technologies, so that the application is performant, scalable, and maintainable.

#### Acceptance Criteria

1. THE Pome App SHALL use Next.js App Router with Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and React Server Components (RSC)
2. THE Pome App SHALL use TypeScript for all application code
3. THE Pome App SHALL use shadcn/ui components with Tailwind CSS for styling
4. THE Pome App SHALL use Neon PostgreSQL as the database platform (Phase 2+)
5. THE Pome App SHALL use Prisma as the ORM for database access (Phase 2+)
6. THE Pome App SHALL use NextAuth.js with JWT strategy for authentication (Phase 3+)
7. THE Pome App SHALL be deployed on Vercel platform

### Requirement 21: Internationalization (i18n) Infrastructure

**User Story:** As a user, I want the application to support multiple languages, so that I can use the app in my preferred language.

#### Acceptance Criteria

1. THE Pome App SHALL use next-intl library for internationalization
2. THE Pome App SHALL support English (en) as the initial language in Phase 1
3. THE Pome App SHALL use translation keys for all user-facing text instead of hardcoded strings
4. THE Pome App SHALL store translation files in JSON format in a `/messages` directory
5. THE Pome App SHALL provide a language switcher in the user profile page
6. THE Pome App SHALL persist the user's language preference in localStorage
7. THE Pome App SHALL prepare the infrastructure to support Korean (ko), Chinese (zh), and Japanese (ja) in future phases
8. WHEN a user changes their language preference, THE Pome App SHALL update all text content immediately without page reload

### Requirement 22: Code Quality and Best Practices

**User Story:** As a developer, I want the codebase to follow best practices, so that it's maintainable and scalable.

#### Acceptance Criteria

1. THE Pome App SHALL use TypeScript strict mode with no `any` types
2. THE Pome App SHALL separate Server Components and Client Components appropriately
3. THE Pome App SHALL use proper React hooks patterns (useState, useEffect, custom hooks)
4. THE Pome App SHALL implement proper error boundaries for error handling
5. THE Pome App SHALL follow Next.js App Router conventions for file naming and structure
6. THE Pome App SHALL use ESLint and Prettier for code formatting and linting
7. THE Pome App SHALL include proper JSDoc comments for complex functions
