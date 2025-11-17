# Implementation Plan

- [x] 1. Project initialization and configuration
  - Initialize Next.js 14+ with App Router and TypeScript
  - Configure Tailwind CSS with custom theme matching existing design
  - Set up ESLint and Prettier for code quality
  - Create directory structure (/src/app, /src/components, /src/lib, /src/hooks, /src/types, /src/data)
  - _Requirements: 1.1, 1.2, 1.3, 20.1, 21.5, 21.6_

- [x] 1.1 Initialize shadcn/ui and install core components
  - Run shadcn/ui init with custom configuration
  - Install Button, Input, Card, Dialog, Dropdown Menu, Sheet, Navigation Menu, Tabs components
  - Customize component styles to match existing design (colors, border radius, shadows)
  - _Requirements: 3.1, 3.2, 3.4, 20.1_

- [x] 1.2 Configure TypeScript and create base type definitions
  - Set up strict TypeScript configuration
  - Create base types in /src/types (User, Treatment, Clinic, ClinicTreatment, SavedItem, SearchResult)
  - Export all types from /src/types/index.ts
  - _Requirements: 1.2, 1.4, 19.1, 19.2, 19.3, 19.4, 19.5, 21.1_

- [x] 2. Create mock data and utilities
  - [x] 2.1 Create mock data files
    - Create /src/data/treatments.ts with 10+ mock treatments matching Treatment type
    - Create /src/data/clinics.ts with 10+ mock clinics matching Clinic type
    - Create /src/data/users.ts with mock user data
    - Create /src/data/clinic-treatments.ts for junction data
    - _Requirements: 17.1, 17.2, 17.5_

  - [x] 2.2 Create utility functions
    - Create /src/lib/utils.ts with cn() utility and other helpers
    - Create /src/lib/constants.ts for app constants (routes, labels, etc.)
    - Create /src/lib/mock-auth.ts with mock authentication functions
    - _Requirements: 17.3, 17.4_

- [x] 3. Implement authentication context and hooks (mock)
  - [x] 3.1 Create authentication context
    - Create AuthContext with mock login/logout functions
    - Implement localStorage-based session persistence
    - Create AuthProvider component
    - _Requirements: 16.3, 16.5_

  - [x] 3.2 Create useAuth hook
    - Implement useAuth() hook to access auth context
    - Provide user, isAuthenticated, login, logout, isLoading
    - _Requirements: 16.3, 16.4_

  - [x] 3.3 Create route protection utilities
    - Create withAuth HOC or hook for protected routes
    - Implement redirect logic for unauthenticated users
    - Store intended destination for post-login redirect
    - _Requirements: 5.2, 5.3, 5.4_

- [x] 4. Set up internationalization (i18n) infrastructure
  - [x] 4.1 Install and configure next-intl
    - Install next-intl package
    - Create i18n.ts configuration file
    - Configure Next.js to use next-intl
    - Set up middleware for locale detection
    - _Requirements: 21.1, 21.2_

  - [x] 4.2 Create translation file structure
    - Create /messages directory in project root
    - Create en.json with comprehensive English translations
    - Organize translations by feature (common, nav, home, auth, treatments, clinics, profile, search, saved)
    - Document translation key naming conventions
    - _Requirements: 21.3, 21.4_

  - [x] 4.3 Create language utilities and hooks
    - Create useLanguage() hook for language switching
    - Implement localStorage persistence for language preference
    - Create language switcher component for profile page
    - Add type definitions for translation keys
    - _Requirements: 21.5, 21.6, 21.8_

  - [x] 4.4 Prepare for future language support
    - Create placeholder files for ko.json, zh.json, ja.json (empty objects)
    - Document translation workflow for future phases
    - Add comments in en.json to guide translators
    - _Requirements: 21.7_

- [x] 5. Create layout components
  - [x] 5.1 Create root layout
    - Implement /src/app/layout.tsx with HTML structure
    - Configure Inter font with next/font
    - Add ThemeProvider for dark mode
    - Wrap with AuthProvider and i18n providers
    - _Requirements: 2.3, 2.4, 21.1_

  - [x] 5.2 Create page layout component
    - Create /src/components/layout/page-layout.tsx
    - Accept children, showHeader, showBottomNav, title props
    - Implement responsive container
    - _Requirements: 18.1, 18.3_

  - [x] 5.3 Create header component
    - Create /src/components/layout/header.tsx as Client Component
    - Display logo/brand name using translation keys
    - Add conditional back button
    - Add user menu when authenticated
    - _Requirements: 6.1, 21.3_

  - [x] 5.4 Create bottom navigation component
    - Create /src/components/layout/bottom-nav.tsx as Client Component
    - Implement 5 tabs using translation keys: Home, Procedures, Clinics, Saved, Profile
    - Use Lucide icons (Home, Building2, Sparkles, Bookmark, User)
    - Highlight active tab based on current route
    - Add fixed positioning with backdrop blur
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 3.3, 21.3_

- [x] 6. Create card components
  - [x] 6.1 Create clinic card component
    - Create /src/components/cards/clinic-card.tsx
    - Display clinic image, name, location, rating, verified badge using translation keys
    - Implement hover effects and click handling
    - Use shadcn/ui Card component
    - _Requirements: 2.1, 2.2, 2.5, 3.2, 21.3_

  - [x] 6.2 Create treatment card component
    - Create /src/components/cards/treatment-card.tsx
    - Display treatment icon (Lucide), name, description, price range using translation keys
    - Support highlighted state for featured items
    - Implement responsive grid layout
    - _Requirements: 2.1, 2.2, 2.5, 3.2, 3.3, 21.3_

  - [x] 6.3 Create procedure list item component
    - Create /src/components/cards/procedure-list-item.tsx
    - Display treatment in list format using translation keys
    - Show clinic count if applicable
    - _Requirements: 2.1, 2.2, 21.3_

- [x] 7. Create search components
  - [x] 7.1 Create search input component
    - Create /src/components/search/search-input.tsx as Client Component
    - Implement debounced input (300ms)
    - Add search icon and clear button with translation keys
    - Handle Enter key for search submission
    - Show loading state
    - _Requirements: 8.1, 8.5, 8.6, 3.2, 21.3_

  - [x] 7.2 Create search autocomplete component
    - Create /src/components/search/search-autocomplete.tsx as Client Component
    - Display dropdown with treatment suggestions
    - Limit to 10 results
    - Handle click to navigate to treatment detail
    - _Requirements: 8.2, 8.3, 8.4_

  - [x] 7.3 Create useSearch hook
    - Create /src/hooks/use-search.ts
    - Implement client-side search logic for mock data
    - Filter treatments and clinics based on query
    - Determine result type (treatment, clinic, mixed)
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 8. Implement homepage
  - [x] 8.1 Create homepage layout
    - Create /src/app/page.tsx as Server Component
    - Implement hero banner with background image and tagline using translation keys
    - Add sticky search input
    - _Requirements: 4.1, 4.3, 6.1, 6.2, 21.3_

  - [x] 8.2 Add featured clinics section
    - Display "Featured Clinics" heading with "See All" link using translation keys
    - Implement horizontal scrollable container
    - Render clinic cards from mock data
    - Link "See All" to /clinics (protected)
    - _Requirements: 6.2, 6.4, 21.3_

  - [x] 8.3 Add popular procedures section
    - Display "Popular Procedures" heading with "See All" link using translation keys
    - Implement 2-column grid (mobile) / 4-column (desktop)
    - Render treatment cards from mock data
    - Link "See All" to /treatments (protected)
    - _Requirements: 6.3, 6.5, 21.3_

  - [x] 8.4 Implement card click handlers
    - Treatment cards navigate to /treatments/[id] (public)
    - Clinic cards navigate to /clinics/[id] (protected)
    - _Requirements: 6.6, 6.7_

- [x] 9. Implement login page
  - [x] 9.1 Create login form component
    - Create /src/components/forms/login-form.tsx as Client Component
    - Add email and password inputs using shadcn/ui Input with translation keys
    - Implement password visibility toggle
    - Add "Remember me" checkbox with translation
    - Show loading state during submission
    - Display error messages using translation keys
    - _Requirements: 16.1, 16.2, 16.4, 3.2, 21.3_

  - [x] 9.2 Create login page
    - Create /src/app/login/page.tsx
    - Render login form with translated content
    - Handle form submission with mock auth
    - Redirect to intended page or homepage after login
    - Add link to registration page (placeholder) with translation
    - _Requirements: 16.1, 16.3, 16.5, 16.6, 21.3_

- [x] 10. Implement treatments pages
  - [x] 10.1 Create treatments list page
    - Create /src/app/treatments/page.tsx as Server Component
    - Add route protection (require auth)
    - Display search input with autocomplete using translation keys
    - Implement filter UI (categories, price range) using shadcn/ui Sheet with translations
    - Add sort dropdown (popularity, price, name) with translations
    - Render treatment cards in grid layout
    - _Requirements: 5.1, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 21.3_

  - [x] 10.2 Create treatment detail page
    - Create /src/app/treatments/[id]/page.tsx as Server Component
    - Make page public (no auth required)
    - Display treatment header (name, icon, price range) with translation keys
    - Show description, duration, recovery time, risks, categories with translations
    - Display before/after images if available
    - List clinics offering this treatment
    - Add save button (requires login to function) with translation
    - _Requirements: 4.2, 5.1, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 21.3_

- [x] 11. Implement clinics pages
  - [x] 11.1 Create clinics list page
    - Create /src/app/clinics/page.tsx as Server Component
    - Add route protection (require auth)
    - Display search input with translation keys
    - Implement filter UI (location, specialties, verified, price level) with translations
    - Add sort dropdown (rating, name, location) with translations
    - Render clinic cards in grid layout
    - _Requirements: 5.1, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 21.3_

  - [x] 11.2 Create clinic detail page
    - Create /src/app/clinics/[id]/page.tsx as Server Component
    - Add route protection (require auth)
    - Display clinic header (name, location, rating, verified badge) with translation keys
    - Show image gallery
    - Display description, specialties, opening hours, contact info with translations
    - Add Kakao Map link
    - List available treatments
    - Add save button with translation
    - _Requirements: 5.1, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 21.3_

- [x] 12. Implement search results page
  - [x] 12.1 Create search results page
    - Create /src/app/search/page.tsx as Server Component
    - Add route protection (require auth)
    - Read query parameter from URL (?q=)
    - Display search input pre-filled with query
    - Show results count with translation
    - _Requirements: 5.1, 9.1, 9.4, 21.3_

  - [x] 12.2 Implement search result logic
    - Use useSearch hook to filter mock data
    - Case 1: Show treatments first, then related clinics
    - Case 2: Show only matching clinics
    - Automatically detect result type
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 12.3 Render search results
    - Display treatments section with treatment cards using translation keys
    - Display clinics section with clinic cards using translation keys
    - Show empty state if no results with translation
    - Handle clicks to navigate to detail pages
    - _Requirements: 9.5, 9.6, 21.3_

- [x] 13. Implement saved items functionality
  - [x] 13.1 Create saved items context and hook
    - Create /src/hooks/use-saved-items.ts
    - Implement localStorage-based persistence
    - Provide saveItem, unsaveItem, isSaved functions
    - _Requirements: 14.4_

  - [x] 13.2 Create saved items page
    - Create /src/app/saved/page.tsx as Server Component
    - Add route protection (require auth)
    - Implement tabs for "Treatments" and "Clinics" using shadcn/ui Tabs with translations
    - Display saved items in grid layout
    - Show empty state with call-to-action if no saved items using translation keys
    - Add remove button on each item with translation
    - _Requirements: 5.1, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 21.3_

  - [x] 13.3 Add save buttons to detail pages
    - Add save/unsave button to treatment detail page with translation
    - Add save/unsave button to clinic detail page with translation
    - Show login prompt if user not authenticated with translation
    - Update UI state when item is saved/unsaved
    - _Requirements: 14.4, 21.3_

- [x] 14. Implement profile page
  - [x] 14.1 Create profile page
    - Create /src/app/profile/page.tsx as Server Component with Client Components
    - Add route protection (require auth)
    - Display user name and email with translation keys
    - Show language preference selector with translations (English, Korean, Chinese, Japanese)
    - Display user preferences (gender, age range, skin type, treatment goals) if available with translations
    - Add logout button with translation
    - _Requirements: 5.1, 15.1, 15.2, 15.3, 15.4, 15.6, 21.3, 21.5, 21.8_

  - [x] 14.2 Implement logout functionality
    - Handle logout button click
    - Clear authentication state
    - Redirect to homepage
    - _Requirements: 15.5_

- [x] 15. Implement responsive design
  - [x] 15.1 Add responsive breakpoints
    - Configure Tailwind breakpoints (mobile < 640px, tablet 640-1024px, desktop > 1024px)
    - Test all pages at different viewport sizes
    - _Requirements: 18.1, 18.5_

  - [x] 15.2 Optimize mobile layout
    - Ensure bottom navigation is visible and functional on mobile
    - Use single column layouts on mobile
    - Implement horizontal scrolling for card lists
    - Ensure touch targets are at least 44x44px
    - _Requirements: 18.2, 18.3, 18.4_

  - [x] 15.3 Enhance desktop layout
    - Use multi-column grids on desktop
    - Show sidebar filters instead of sheets
    - Add hover states and transitions
    - Use larger images and content areas
    - _Requirements: 18.5_

- [x] 16. Add error handling and loading states
  - [x] 16.1 Create error boundaries
    - Create /src/app/error.tsx for root error boundary
    - Add page-level error boundaries where needed
    - Display user-friendly error messages with translation keys
    - Provide retry mechanisms with translation
    - _Requirements: 22.4, 21.3_

  - [x] 16.2 Create loading states
    - Create /src/app/loading.tsx for root loading state
    - Add loading.tsx files for route-level loading
    - Implement skeleton loaders for cards and lists
    - Show loading spinners for form submissions with translation
    - Disable buttons during async operations
    - _Requirements: 22.4, 21.3_

  - [x] 16.3 Create not found page
    - Create /src/app/not-found.tsx for 404 handling
    - Handle invalid treatment/clinic IDs gracefully with translation
    - Provide navigation back to main pages with translation
    - _Requirements: 22.4, 21.3_

- [x] 17. Implement dark mode
  - [x] 17.1 Configure theme provider
    - Install and configure next-themes
    - Add ThemeProvider to root layout
    - Set up dark mode class strategy
    - _Requirements: 2.4_

  - [x] 17.2 Apply dark mode styles
    - Use Tailwind dark: variants for all components
    - Test all pages in both light and dark mode
    - Ensure proper contrast and readability
    - _Requirements: 2.4_

- [ ] 18. Final polish and testing
  - [ ] 18.1 Verify visual parity
    - Compare all pages with original design
    - Check spacing, colors, typography, border radius
    - Ensure all Lucide icons match original intent
    - Verify all text uses translation keys (no hardcoded strings)
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 3.3, 21.3_

  - [ ] 18.2 Test all user flows
    - Test navigation between all pages
    - Verify protected route redirects work correctly
    - Test search and autocomplete functionality
    - Test save/unsave functionality
    - Test login/logout flow
    - Test language switching functionality
    - _Requirements: 5.2, 5.3, 5.4, 6.4, 6.5, 6.6, 6.7, 7.3, 7.4, 7.5, 7.6, 8.4, 8.5, 8.6, 21.8_

  - [ ] 18.3 Verify TypeScript types
    - Run TypeScript compiler to check for errors
    - Ensure no `any` types are used
    - Verify all props have proper type definitions
    - _Requirements: 1.4, 22.1_

  - [ ] 18.4 Run linting and formatting
    - Run ESLint and fix any issues
    - Run Prettier to format all files
    - Ensure code quality standards are met
    - _Requirements: 22.6_

  - [ ] 18.5 Test responsive design
    - Test on mobile viewport (375px, 414px)
    - Test on tablet viewport (768px, 1024px)
    - Test on desktop viewport (1280px, 1920px)
    - Verify all interactions work on touch devices
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

  - [ ] 18.6 Performance check
    - Verify Server Components are used where appropriate
    - Check bundle size
    - Test page load times
    - Ensure images are optimized
    - _Requirements: 22.2_

  - [ ] 18.7 Test i18n implementation
    - Verify all pages display translated content correctly
    - Test language persistence across page navigation
    - Ensure no hardcoded strings remain in the UI
    - Verify translation keys are properly organized
    - _Requirements: 21.3, 21.4, 21.6_

- [ ] 19. Documentation and preparation for Phase 2
  - [ ] 19.1 Document component API
    - Add JSDoc comments to all components
    - Document props and usage examples
    - Document i18n translation key usage patterns
    - _Requirements: 22.7, 21.4_

  - [ ] 19.2 Create README
    - Document project setup instructions
    - List available scripts
    - Explain folder structure
    - Add i18n usage guide and translation workflow
    - Add Phase 2 preparation notes
    - _Requirements: 22.7, 21.7_

  - [ ] 19.3 Prepare for database integration
    - Verify TypeScript interfaces match Prisma schema requirements
    - Document where API calls will replace mock data
    - Create placeholder API route files
    - _Requirements: 19.1, 19.2, 19.3, 19.4_
