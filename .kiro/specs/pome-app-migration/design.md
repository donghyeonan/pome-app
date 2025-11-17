# Design Document

## Overview

This design document outlines the technical architecture and implementation approach for migrating the Pome web application from Next.js Pages Router (JavaScript) to App Router (TypeScript). The design focuses on Phase 1: creating a production-ready UI with mock data, proper TypeScript types, and shadcn/ui components while maintaining 1:1 visual parity with the existing application.

The migration will establish a solid foundation for future phases (database integration, authentication, search functionality, and saved items) while delivering a fully functional, type-safe frontend.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Next.js App Router (React 19)               │  │
│  │                                                         │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │   Server    │  │    Client    │  │   Shared     │ │  │
│  │  │ Components  │  │  Components  │  │  Components  │ │  │
│  │  └─────────────┘  └──────────────┘  └──────────────┘ │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         shadcn/ui + Tailwind CSS                │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   Mock Data      │
                  │  (/src/data)     │
                  └──────────────────┘
```

### Directory Structure

```
pome-app/
├── messages/                         # i18n translation files
│   ├── en.json                       # English translations
│   ├── ko.json                       # Korean translations (future)
│   ├── zh.json                       # Chinese translations (future)
│   └── ja.json                       # Japanese translations (future)
│
├── src/
│   ├── app/                          # App Router pages
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Homepage (/)
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── treatments/
│   │   │   ├── page.tsx              # Treatments list (protected)
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Treatment detail (public)
│   │   ├── clinics/
│   │   │   ├── page.tsx              # Clinics list (protected)
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Clinic detail (protected)
│   │   ├── search/
│   │   │   └── page.tsx              # Search results (protected)
│   │   ├── saved/
│   │   │   └── page.tsx              # Saved items (protected)
│   │   ├── profile/
│   │   │   └── page.tsx              # User profile (protected)
│   │   └── api/                      # API routes (empty for Phase 1)
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   └── tabs.tsx
│   │   ├── layout/                   # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── bottom-nav.tsx
│   │   │   └── page-layout.tsx
│   │   ├── search/                   # Search components
│   │   │   ├── search-input.tsx
│   │   │   └── search-autocomplete.tsx
│   │   ├── cards/                    # Card components
│   │   │   ├── clinic-card.tsx
│   │   │   ├── treatment-card.tsx
│   │   │   └── procedure-list-item.tsx
│   │   └── forms/                    # Form components
│   │       └── login-form.tsx
│   │
│   ├── lib/                          # Utility functions
│   │   ├── utils.ts                  # General utilities (cn, etc.)
│   │   ├── mock-auth.ts              # Mock authentication (Phase 1)
│   │   └── constants.ts              # App constants
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-auth.ts               # Authentication hook (mock)
│   │   ├── use-search.ts             # Search functionality hook
│   │   └── use-saved-items.ts        # Saved items hook (mock)
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── index.ts                  # Main type exports
│   │   ├── treatment.ts              # Treatment types
│   │   ├── clinic.ts                 # Clinic types
│   │   ├── user.ts                   # User types
│   │   └── search.ts                 # Search types
│   │
│   ├── data/                         # Mock data (Phase 1)
│   │   ├── treatments.ts             # Mock treatments
│   │   ├── clinics.ts                # Mock clinics
│   │   └── users.ts                  # Mock users
│   │
│   └── styles/
│       └── globals.css               # Global styles + Tailwind
│
├── public/                           # Static assets
│   └── images/
│
├── components.json                   # shadcn/ui config
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── next.config.mjs                   # Next.js configuration
├── package.json
└── .env.local                        # Environment variables
```

## Components and Interfaces

### Core Layout Components

#### 1. Root Layout (`app/layout.tsx`)
- **Purpose**: Provides global layout structure, theme provider, and font configuration
- **Type**: Server Component
- **Features**:
  - Dark mode support via `next-themes`
  - Inter font family configuration
  - Global metadata (title, description)
  - HTML structure with proper lang attribute

#### 2. Page Layout (`components/layout/page-layout.tsx`)
- **Purpose**: Wraps page content with header and bottom navigation
- **Type**: Client Component
- **Props**:
  ```typescript
  interface PageLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    showBottomNav?: boolean;
    title?: string;
  }
  ```

#### 3. Header (`components/layout/header.tsx`)
- **Purpose**: Top navigation with logo and user actions
- **Type**: Client Component
- **Features**:
  - Logo/brand name
  - Back button (conditional)
  - User menu (when authenticated)
  - Responsive design

#### 4. Bottom Navigation (`components/layout/bottom-nav.tsx`)
- **Purpose**: Mobile-first bottom navigation bar
- **Type**: Client Component
- **Features**:
  - 5 tabs: Home, Procedures, Clinics, Saved, Profile
  - Active state highlighting
  - Lucide icons
  - Protected route indicators
  - Fixed positioning with backdrop blur

### Card Components

#### 1. Clinic Card (`components/cards/clinic-card.tsx`)
- **Purpose**: Display clinic information in lists
- **Type**: Client Component
- **Props**:
  ```typescript
  interface ClinicCardProps {
    clinic: Clinic;
    onClick?: () => void;
  }
  ```
- **Features**:
  - Clinic image with fallback
  - Name and location
  - Rating display
  - Verified badge
  - Hover effects

#### 2. Treatment Card (`components/cards/treatment-card.tsx`)
- **Purpose**: Display treatment information in grids
- **Type**: Client Component
- **Props**:
  ```typescript
  interface TreatmentCardProps {
    treatment: Treatment;
    highlighted?: boolean;
    onClick?: () => void;
  }
  ```
- **Features**:
  - Treatment icon (Lucide)
  - Name and description
  - Price range indicator
  - Highlight state for featured items

#### 3. Procedure List Item (`components/cards/procedure-list-item.tsx`)
- **Purpose**: Display treatment in list view
- **Type**: Client Component
- **Props**:
  ```typescript
  interface ProcedureListItemProps {
    treatment: Treatment;
    showClinicCount?: boolean;
  }
  ```

### Search Components

#### 1. Search Input (`components/search/search-input.tsx`)
- **Purpose**: Search bar with autocomplete
- **Type**: Client Component
- **Props**:
  ```typescript
  interface SearchInputProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    showAutocomplete?: boolean;
  }
  ```
- **Features**:
  - Debounced input (300ms)
  - Autocomplete dropdown
  - Enter key handling
  - Clear button
  - Loading state

#### 2. Search Autocomplete (`components/search/search-autocomplete.tsx`)
- **Purpose**: Dropdown showing treatment suggestions
- **Type**: Client Component
- **Props**:
  ```typescript
  interface SearchAutocompleteProps {
    query: string;
    results: Treatment[];
    onSelect: (treatment: Treatment) => void;
  }
  ```

### Form Components

#### 1. Login Form (`components/forms/login-form.tsx`)
- **Purpose**: Email/password login form
- **Type**: Client Component
- **Features**:
  - Email validation
  - Password input with toggle visibility
  - Error message display
  - Loading state during submission
  - Redirect after login

## Data Models

### TypeScript Interfaces

#### User Type (`types/user.ts`)
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  languagePreference: 'en' | 'ko';
  gender?: 'male' | 'female' | 'other';
  ageRange?: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  skinType?: 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';
  treatmentGoals?: string[]; // e.g., ["reduce_wrinkles", "improve_skin_tone"]
  createdAt: Date;
}
```

#### Treatment Type (`types/treatment.ts`)
```typescript
export interface Treatment {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  priceRange: {
    min: number;
    max: number;
    currency: 'KRW' | 'USD';
  };
  duration: string; // e.g., "30-60 minutes"
  risks: string[];
  categories: string[]; // e.g., ["skin rejuvenation", "anti-aging"]
  recoveryTime: string; // e.g., "1-3 days"
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

#### Clinic Type (`types/clinic.ts`)
```typescript
export interface Clinic {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  rating: number; // 0-5
  reviewCount?: number;
  specialties: string[];
  kakaoMapLink?: string;
  verified: boolean;
  priceLevel?: 1 | 2 | 3; // $, $$, $$$
  openingHours?: {
    [key: string]: string; // e.g., "monday": "9:00 AM - 6:00 PM"
  };
  phoneNumber?: string;
  websiteUrl?: string;
  photos?: string[];
}
```

#### Clinic-Treatment Relationship (`types/clinic.ts`)
```typescript
export interface ClinicTreatment {
  clinicId: string;
  treatmentId: string;
  price?: number;
  availability: 'available' | 'limited' | 'unavailable';
}
```

#### Saved Item Type (`types/user.ts`)
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

#### Search Result Type (`types/search.ts`)
```typescript
export interface SearchResult {
  treatments: Treatment[];
  clinics: Clinic[];
  query: string;
  resultType: 'treatment' | 'clinic' | 'mixed';
}
```

## Page Implementations

### 1. Homepage (`app/page.tsx`)
- **Type**: Server Component
- **Data**: Fetches featured clinics and popular treatments from mock data
- **Sections**:
  - Hero banner with background image
  - Search input (sticky on scroll)
  - Featured Clinics (horizontal scroll)
  - Popular Procedures (2-column grid on mobile, 4-column on desktop)
  - Bottom navigation
- **Interactions**:
  - "See All" links navigate to protected routes
  - Treatment cards navigate to public detail pages
  - Clinic cards navigate to protected detail pages

### 2. Treatments List (`app/treatments/page.tsx`)
- **Type**: Server Component with Client Components for filters
- **Protection**: Requires authentication
- **Features**:
  - Search bar with autocomplete
  - Filter sidebar/sheet (categories, price range)
  - Sort dropdown (popularity, price, name)
  - Grid layout of treatment cards
  - Pagination or infinite scroll

### 3. Treatment Detail (`app/treatments/[id]/page.tsx`)
- **Type**: Server Component
- **Protection**: Public (no auth required)
- **Sections**:
  - Treatment header (name, icon, price range)
  - Description and details
  - Duration and recovery time
  - Risks and considerations
  - Before/after images gallery
  - List of clinics offering this treatment
  - Save button (requires login)

### 4. Clinics List (`app/clinics/page.tsx`)
- **Type**: Server Component with Client Components for filters
- **Protection**: Requires authentication
- **Features**:
  - Search bar
  - Filter sidebar (location, specialties, verified, price level)
  - Sort dropdown (rating, name, location)
  - Grid layout of clinic cards
  - Map view toggle (future enhancement)

### 5. Clinic Detail (`app/clinics/[id]/page.tsx`)
- **Type**: Server Component
- **Protection**: Requires authentication
- **Sections**:
  - Clinic header (name, location, rating, verified badge)
  - Image gallery
  - Description and specialties
  - Opening hours and contact info
  - Kakao Map link
  - List of available treatments
  - Save button
  - Reviews section (future enhancement)

### 6. Search Results (`app/search/page.tsx`)
- **Type**: Server Component with Client Components
- **Protection**: Requires authentication
- **Logic**:
  - Reads `?q=` query parameter
  - Searches treatments and clinics
  - Determines result type automatically
  - Case 1 (treatment keyword): Shows treatments first, then related clinics
  - Case 2 (clinic name): Shows only matching clinics
- **Sections**:
  - Search input (pre-filled with query)
  - Results count
  - Treatments section (if applicable)
  - Clinics section (if applicable)
  - Empty state if no results

### 7. Saved Items (`app/saved/page.tsx`)
- **Type**: Server Component
- **Protection**: Requires authentication
- **Features**:
  - Tabs for "Treatments" and "Clinics"
  - Grid layout of saved items
  - Remove button on each item
  - Empty state with call-to-action
  - Mock implementation using localStorage in Phase 1

### 8. Profile (`app/profile/page.tsx`)
- **Type**: Server Component with Client Components for forms
- **Protection**: Requires authentication
- **Sections**:
  - User info display (name, email)
  - Language preference selector
  - User preferences (gender, age range, skin type, treatment goals)
  - Logout button
  - Account settings (future enhancement)

### 9. Login (`app/login/page.tsx`)
- **Type**: Server Component with Client Component form
- **Features**:
  - Email and password inputs
  - "Remember me" checkbox
  - Login button with loading state
  - Link to registration (future)
  - Error message display
  - Redirect to intended page after login
  - Mock authentication in Phase 1

## Styling and Design System

### Tailwind Configuration

```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#D90429',
        background: {
          light: '#F5F5F7',
          dark: '#1C1C1E',
        },
        text: {
          primary: {
            light: '#2C2C2E',
            dark: '#F2F2F7',
          },
          secondary: {
            light: '#8A8A8E',
            dark: '#8E8E93',
          },
        },
        card: {
          light: '#FFFFFF',
          dark: '#2C2C2E',
        },
        search: {
          light: '#EFEFF4',
          dark: '#3A3A3C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
};
```

### shadcn/ui Customization

- Initialize with existing color scheme
- Customize component styles to match design
- Use `cn()` utility for conditional classes
- Maintain soft shadows and rounded corners
- Ensure dark mode compatibility

### Icon Mapping (Material Symbols → Lucide)

| Material Symbol | Lucide Icon | Usage |
|----------------|-------------|-------|
| home | Home | Bottom nav home |
| apartment | Building2 | Clinics tab |
| healing | Sparkles | Treatments/procedures |
| bookmark | Bookmark | Saved items |
| person | User | Profile |
| search | Search | Search input |
| auto_awesome | Sparkles | Featured/highlighted |
| syringe | Syringe | Botox treatment |
| face_6 | User | Face treatments |
| dermatology | Droplet | Skin treatments |

## Internationalization (i18n) Architecture

### Overview
The application uses `next-intl` for internationalization, providing a type-safe and performant solution for multi-language support. In Phase 1, we set up the infrastructure with English translations only, making it easy to add additional languages in future phases.

### Translation File Structure

```json
// messages/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "search": "Search",
    "loading": "Loading...",
    "error": "An error occurred"
  },
  "nav": {
    "home": "Home",
    "procedures": "Procedures",
    "clinics": "Clinics",
    "saved": "Saved",
    "profile": "Profile"
  },
  "home": {
    "title": "Your Trusted Guide to Beauty in Korea",
    "featuredClinics": "Featured Clinics",
    "popularProcedures": "Popular Procedures",
    "seeAll": "See All"
  },
  "auth": {
    "login": "Log In",
    "logout": "Log Out",
    "email": "Email",
    "password": "Password",
    "rememberMe": "Remember me",
    "invalidCredentials": "Invalid email or password"
  },
  "treatments": {
    "title": "Treatments",
    "description": "Description",
    "priceRange": "Price Range",
    "duration": "Duration",
    "recoveryTime": "Recovery Time",
    "risks": "Risks"
  },
  "clinics": {
    "title": "Clinics",
    "location": "Location",
    "rating": "Rating",
    "verified": "Verified",
    "openingHours": "Opening Hours"
  }
}
```

### i18n Configuration

```typescript
// i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default
}));
```

### Usage in Components

#### Server Components
```typescript
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('featuredClinics')}</p>
    </div>
  );
}
```

#### Client Components
```typescript
'use client';

import { useTranslations } from 'next-intl';

export function LoginForm() {
  const t = useTranslations('auth');
  
  return (
    <form>
      <input placeholder={t('email')} />
      <input type="password" placeholder={t('password')} />
      <button>{t('login')}</button>
    </form>
  );
}
```

### Language Switching

```typescript
// hooks/use-language.ts
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export function useLanguage() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const changeLanguage = (newLocale: string) => {
    // Store preference in localStorage
    localStorage.setItem('preferredLanguage', newLocale);
    
    // Update URL with new locale
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return { currentLocale, changeLanguage };
}
```

### Phase 1 Implementation Strategy

1. **Install next-intl**: Add the library to the project
2. **Create folder structure**: Set up `/messages` directory
3. **Create English translations**: Build comprehensive `en.json` file
4. **Use translation keys everywhere**: Never hardcode user-facing text
5. **Add language switcher**: Implement in profile page
6. **Prepare for future languages**: Document translation key structure

### Future Language Support (Phase 4+)

Languages to add:
- **Korean (ko)**: Primary target audience
- **Chinese (zh)**: Secondary target audience
- **Japanese (ja)**: Secondary target audience

Translation approach:
- Professional translation service
- Community contributions
- AI-assisted translation with human review

## State Management

### Phase 1 Approach (No Backend)

#### Authentication State
- Use React Context (`AuthContext`) for mock authentication
- Store mock user in localStorage
- Provide `useAuth()` hook for components
- Mock login/logout functions

```typescript
// lib/mock-auth.ts
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

#### Saved Items State
- Use localStorage to persist saved items
- Provide `useSavedItems()` hook
- Mock save/unsave functions

```typescript
// hooks/use-saved-items.ts
export interface SavedItemsContextType {
  savedItems: SavedItem[];
  saveItem: (itemType: 'clinic' | 'treatment', itemId: string) => void;
  unsaveItem: (itemId: string) => void;
  isSaved: (itemId: string) => boolean;
}
```

#### Search State
- Use URL search params for query persistence
- Debounce search input
- Client-side filtering of mock data

## Error Handling

### Error Boundaries
- Implement root error boundary in `app/error.tsx`
- Implement page-level error boundaries where needed
- Display user-friendly error messages
- Provide retry mechanisms

### Loading States
- Use `loading.tsx` files for route-level loading states
- Implement skeleton loaders for cards and lists
- Show loading spinners for form submissions
- Disable buttons during async operations

### Not Found Handling
- Implement `not-found.tsx` for 404 pages
- Handle invalid treatment/clinic IDs gracefully
- Provide navigation back to main pages

## Responsive Design Strategy

### Breakpoints
- Mobile: < 640px (default)
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile-First Approach
- Bottom navigation visible on mobile/tablet
- Single column layouts on mobile
- Horizontal scrolling for card lists
- Touch-friendly tap targets (min 44x44px)

### Desktop Enhancements
- Multi-column grids
- Sidebar filters instead of sheets
- Hover states and transitions
- Larger images and content

## Performance Considerations

### Next.js Optimizations
- Use Server Components by default
- Client Components only when needed (interactivity, hooks)
- Image optimization with `next/image`
- Font optimization with `next/font`
- Metadata optimization for SEO

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting (automatic with App Router)
- Lazy load images below the fold

### Mock Data Performance
- Keep mock data files small and focused
- Use memoization for expensive computations
- Implement virtual scrolling for long lists (future)

## Testing Strategy

### Phase 1 Testing Approach
- Manual testing of all pages and interactions
- Visual regression testing (optional)
- TypeScript type checking as first line of defense
- ESLint for code quality

### Future Testing (Phase 2+)
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows
- Component testing with React Testing Library

## Migration Path from Pages Router

### Key Differences to Address

1. **File-based Routing**
   - Pages Router: `pages/index.js` → `/`
   - App Router: `app/page.tsx` → `/`

2. **Layouts**
   - Pages Router: `_app.js` for global layout
   - App Router: `layout.tsx` for nested layouts

3. **Data Fetching**
   - Pages Router: `getServerSideProps`, `getStaticProps`
   - App Router: Server Components with async/await

4. **Client Components**
   - Pages Router: All components are client by default
   - App Router: Must use `'use client'` directive

5. **API Routes**
   - Pages Router: `pages/api/`
   - App Router: `app/api/` (same structure)

### Component Conversion Strategy

1. Identify client-side interactivity needs
2. Keep components as Server Components when possible
3. Add `'use client'` only when needed:
   - useState, useEffect, event handlers
   - Browser APIs (localStorage, window)
   - Third-party libraries requiring client-side

## Phase 1 Deliverables

### Completed Features
✅ Full TypeScript conversion
✅ App Router structure
✅ shadcn/ui component library
✅ All pages with mock data
✅ Responsive design
✅ Dark mode support
✅ i18n infrastructure with English translations
✅ Search UI with autocomplete
✅ Bottom navigation
✅ Mock authentication flow
✅ Mock saved items functionality

### Not Included in Phase 1
❌ Real database integration
❌ Real authentication
❌ API endpoints
❌ Server-side search
❌ User registration
❌ Email verification
❌ Password reset
❌ Real-time features

### Preparation for Phase 2
- TypeScript interfaces match Prisma schema
- Component structure supports API integration
- Mock data can be easily replaced with API calls
- Authentication context ready for NextAuth
- Folder structure prepared for API routes

## Design Decisions and Rationale

### Why Server Components by Default?
- Better performance (less JavaScript to client)
- Improved SEO
- Simplified data fetching
- Reduced bundle size

### Why shadcn/ui?
- Customizable and owns the code
- Built on Radix UI (accessible)
- Tailwind CSS integration
- TypeScript support
- No runtime dependency

### Why Mock Data in Phase 1?
- Allows UI development without backend delays
- Easier to iterate on design
- Type-safe interfaces prepare for real data
- Can demo full user flows

### Why localStorage for Phase 1 State?
- Simple persistence without backend
- Demonstrates functionality
- Easy to replace with API calls
- Good for prototyping

### Why JWT Strategy for NextAuth (Phase 3)?
- Stateless authentication
- Better scalability
- Works well with Vercel serverless
- Simpler than database sessions

## Conclusion

This design provides a comprehensive blueprint for Phase 1 of the Pome app migration. The architecture is modular, type-safe, and prepared for future phases. By maintaining visual parity with the existing design while modernizing the tech stack, we ensure a smooth transition that delivers immediate value while setting up for long-term success.

The mock data approach allows rapid UI development and iteration, while the TypeScript interfaces and component structure are designed to seamlessly integrate with Neon, Prisma, and NextAuth in subsequent phases.
