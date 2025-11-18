# Phase 3: Authentication - Implementation Tasks

## Overview

This task list implements the Phase 3 authentication system with NextAuth.js, database sessions, secure password management, rate limiting, and email-based password reset functionality.

---

## 1. Project Setup and Dependencies

- [x] 1.1 Install NextAuth.js and authentication dependencies
  - Install `next-auth@^4.24.0`
  - Install `@next-auth/prisma-adapter`
  - Install `bcryptjs` and `@types/bcryptjs`
  - Install `resend` for email service
  - Verify all dependencies in package.json
  - _Requirements: 1.1, 11.1_

- [x] 1.2 Update environment variables
  - Add `NEXTAUTH_URL` to `.env` and `.env.example`
  - Add `NEXTAUTH_SECRET` to `.env` and `.env.example`
  - Add `RESEND_API_KEY` to `.env` and `.env.example`
  - Add `EMAIL_FROM` to `.env` and `.env.example`
  - Document how to generate NEXTAUTH_SECRET (openssl rand -base64 32)
  - Document Resend email configuration (dev vs production)
  - Set `EMAIL_FROM="onboarding@resend.dev"` for development
  - Document domain verification needed for production
  - _Requirements: 1.5, 11.2, 11.3, 18.1-18.6_

---

## 2. Database Schema Updates

- [x] 2.1 Update Prisma schema for NextAuth
  - Add `emailVerified` field to User model
  - Create `Account` model for OAuth (future use)
  - Create `Session` model for database sessions
  - Create `VerificationToken` model for password resets
  - Add indexes on `email`, `sessionToken`, and `token` fields
  - _Requirements: 7.1-7.6_

- [x] 2.2 Generate and run database migration
  - Run `npx prisma migrate dev --name add-nextauth-models`
  - Verify migration creates all tables correctly
  - Update Prisma client with `npx prisma generate`
  - Test database connection
  - _Requirements: 7.6_

- [x] 2.3 Update seed script for authentication
  - Hash test user passwords with bcrypt
  - Ensure test users work with new auth system
  - Add multiple test users for testing
  - Run seed script and verify data
  - _Requirements: 7.7_

---

## 3. Core Authentication Utilities

- [x] 3.1 Create password utility functions
  - Create `/src/lib/password.ts`
  - Implement `hashPassword()` with bcrypt (10 salt rounds)
  - Implement `verifyPassword()` for login
  - Create Zod `passwordSchema` (min 8 chars, 1 letter, 1 number)
  - Implement `validatePassword()` helper
  - _Requirements: 2.1-2.6_

- [x] 3.2 Create rate limiting utility
  - Create `/src/lib/rate-limit.ts`
  - Implement in-memory rate limit store with Map
  - Add WARNING comment about multi-instance limitation
  - Implement `checkRateLimit()` function
  - Add cleanup interval for expired entries
  - Define rate limit constants (REGISTER, FORGOT_PASSWORD)
  - Document limitation in code comments
  - _Requirements: 16.1, 16.7_

- [x] 3.3 Create auth helper utilities
  - Create `/src/lib/auth-helpers.ts`
  - Implement `requireAuth()` for server components
  - Implement `getOptionalAuth()` for optional auth
  - Implement `requireAuthAPI()` for API routes
  - Add TypeScript types for auth helpers
  - _Requirements: 10.1, 10.6_

---

## 4. NextAuth.js Configuration

- [x] 4.1 Create NextAuth configuration
  - Create `/src/lib/auth.ts`
  - Configure PrismaAdapter with database sessions
  - Set session strategy to "database"
  - Configure 30-day session expiration
  - Set up secure cookie configuration
  - _Requirements: 1.2-1.4, 8.1-8.2_

- [x] 4.2 Configure Credentials Provider
  - Add CredentialsProvider to NextAuth config
  - Implement `authorize()` function
  - Validate credentials with Zod
  - Verify password with bcrypt
  - Return user object on success
  - Return generic error on failure
  - _Requirements: 1.6, 4.1-4.5_

- [x] 4.3 Configure NextAuth callbacks
  - Implement `session()` callback for session data (user comes from DB)
  - Include user ID, email, and name in session
  - Do NOT implement `jwt()` callback (not used with database sessions)
  - _Requirements: 8.5_

- [x] 4.4 Create NextAuth API route handler
  - Create `/src/app/api/auth/[...nextauth]/route.ts`
  - Export GET and POST handlers from NextAuth
  - Configure with authOptions
  - Test NextAuth endpoints work
  - _Requirements: 1.3_

- [x] 4.5 Extend NextAuth TypeScript types
  - Create type declarations for Session interface
  - Create type declarations for User interface
  - Create type declarations for JWT interface
  - Add types to `/src/types/next-auth.d.ts`
  - _Requirements: 8.5_

---

## 5. User Registration System

- [x] 5.1 Create registration API endpoint
  - Create `/src/app/api/auth/register/route.ts`
  - Implement rate limiting (5 per 10 min per IP)
  - Validate request body with Zod schema
  - Check for existing email
  - Hash password with bcrypt
  - Create user in database
  - Return success response
  - _Requirements: 3.1-3.9_

- [x] 5.2 Create registration form component
  - Create `/src/components/forms/register-form.tsx`
  - Add email input with validation
  - Add password input with visibility toggle
  - Add confirm password field
  - Display password requirements
  - Validate passwords match
  - Show inline validation errors
  - Disable submit during request
  - _Requirements: 13.1-13.10_

- [x] 5.3 Create registration page
  - Create `/src/app/[locale]/register/page.tsx`
  - Include registration form component
  - Add link to login page
  - Add internationalization support
  - Style with Tailwind CSS
  - _Requirements: 13.4_

- [x] 5.4 Implement auto-login after registration
  - Call NextAuth signIn after successful registration
  - Redirect to intended page or homepage
  - Handle auto-login errors gracefully
  - Show success message
  - _Requirements: 3.7_

---

## 6. Login System Updates

- [x] 6.1 Update login form component
  - Update `/src/components/forms/login-form.tsx`
  - Replace mock auth with NextAuth signIn
  - Handle authentication errors from NextAuth
  - Add "Forgot password?" link
  - Maintain existing styling
  - Add loading states
  - _Requirements: 14.1-14.6_

- [x] 6.2 Update login page
  - Update `/src/app/[locale]/login/page.tsx`
  - Ensure form uses NextAuth
  - Add link to registration page
  - Handle redirect after login
  - Test with existing UI
  - _Requirements: 4.8_

- [x] 6.3 Implement login redirect logic
  - Capture intended destination before login
  - Pass callbackUrl to NextAuth signIn
  - Redirect to intended page after success
  - Default to homepage if no callback
  - _Requirements: 4.8, 9.8, 9.9_

---

## 7. Password Reset System

- [x] 7.1 Create forgot password API endpoint
  - Create `/src/app/api/auth/forgot-password/route.ts`
  - Implement rate limiting (10 per 10 min per IP)
  - Validate email with Zod
  - Delete any existing unexpired tokens for this email (security)
  - Generate secure random token (32 bytes)
  - Hash token with SHA-256 before storage
  - Store hashed token with 1-hour expiration
  - Send email with raw token
  - Always return success (prevent enumeration)
  - _Requirements: 6.1-6.5_

- [x] 7.2 Create reset password API endpoint
  - Create `/src/app/api/auth/reset-password/route.ts`
  - Hash received token for comparison
  - Validate hashed token exists in database
  - Check token expiration
  - Hash new password with bcrypt
  - Update user password
  - Invalidate all user sessions
  - Delete used token
  - Return success (no auto-login)
  - _Requirements: 6.6-6.10_

- [x] 7.3 Create email service utility
  - Create `/src/lib/email.ts`
  - Initialize Resend client
  - Implement `sendPasswordResetEmail()` function
  - Create HTML email template
  - Include reset link with token
  - Add security messaging (1-hour expiry)
  - Handle email sending errors gracefully
  - _Requirements: 11.4-11.8_

- [x] 7.4 Create forgot password form
  - Create `/src/components/forms/forgot-password-form.tsx`
  - Add email input with validation
  - Show success message after submission
  - Handle errors gracefully
  - Add loading state
  - _Requirements: 15.1, 15.5, 15.6_

- [x] 7.5 Create forgot password page
  - Create `/src/app/[locale]/forgot-password/page.tsx`
  - Include forgot password form
  - Add back to login link
  - Add instructions for users
  - Style consistently
  - _Requirements: 15.3_

- [x] 7.6 Create reset password form
  - Create `/src/components/forms/reset-password-form.tsx`
  - Add new password input
  - Add confirm password input
  - Display password requirements
  - Validate passwords match
  - Extract token from URL
  - Handle token validation errors
  - _Requirements: 15.2, 15.7, 15.8_

- [x] 7.7 Create reset password page
  - Create `/src/app/[locale]/reset-password/page.tsx`
  - Include reset password form
  - Validate token from query params
  - Handle expired/invalid tokens
  - Redirect to login after success
  - Show appropriate error messages
  - _Requirements: 15.4, 15.9_

---

## 8. Session Management

- [ ] 8.1 Update authentication context
  - Update `/src/contexts/auth-context.tsx`
  - Replace mock auth with NextAuth useSession
  - Implement login with NextAuth signIn
  - Implement logout with NextAuth signOut
  - Implement register function
  - Maintain existing interface
  - Handle loading states
  - _Requirements: 12.1-12.7_

- [ ] 8.2 Add SessionProvider to app
  - Update root layout to wrap with SessionProvider
  - Import from next-auth/react
  - Ensure all pages have session access
  - _Requirements: 8.7_

- [ ] 8.3 Implement logout functionality
  - Use NextAuth signOut in auth context
  - Clear session and cookies
  - Redirect to homepage
  - Update header logout button
  - _Requirements: 5.1-5.5_

- [ ] 8.4 Test session persistence
  - Verify sessions persist across page refreshes
  - Test 30-day expiration
  - Test session validation on protected routes
  - Verify session updates every 24 hours
  - _Requirements: 8.2-8.4_

---

## 9. Route Protection

- [ ] 9.1 Create Next.js middleware for route protection
  - Create `/middleware.ts` in project root
  - Import and combine next-intl middleware with NextAuth
  - Use `withAuth()` wrapper around intl middleware
  - Configure authorized callback to check for valid token
  - Configure matcher for protected routes with locale prefixes
  - Protect `/:locale/clinics/*` routes
  - Protect `/:locale/treatments` list route
  - Protect `/:locale/search/*` routes
  - Protect `/:locale/saved/*` routes
  - Protect `/:locale/profile/*` routes
  - Protect `/api/saved/*` API routes
  - _Requirements: 9.1-9.7_

- [ ] 9.2 Update API routes with authentication
  - Update `/src/app/api/saved/route.ts` (GET and POST)
  - Update `/src/app/api/saved/[id]/route.ts` (DELETE)
  - Add `requireAuthAPI()` to all protected endpoints
  - Return 401 for unauthenticated requests
  - Extract user ID from session
  - _Requirements: 10.1-10.5_

- [ ] 9.3 Replace mock user ID with real session user ID
  - Update saved items API to use session.user.id
  - Remove hardcoded mock user ID
  - Ensure user-specific data isolation
  - Test saved items with real auth
  - _Requirements: 10.6, 10.7_

- [ ] 9.4 Test route protection
  - Test unauthenticated access redirects to login
  - Test authenticated access works
  - Test redirect to intended page after login
  - Test API returns 401 without auth
  - _Requirements: 9.7-9.9_

---

## 10. UI Updates

- [ ] 10.1 Update header component
  - Update `/src/components/layout/header.tsx`
  - Show real user info from session
  - Update logout button to use auth context
  - Handle loading states
  - Update login/register links
  - _Requirements: 12.7_

- [ ] 10.2 Update navigation for protected routes
  - Ensure protected links check authentication
  - Show appropriate UI for unauthenticated users
  - Handle loading states during auth check
  - _Requirements: 9.1-9.9_

- [ ] 10.3 Add authentication status indicators
  - Show login status in UI
  - Add loading indicators during auth operations
  - Display clear error messages
  - Provide user feedback for all auth actions
  - _Requirements: 16.1_

- [ ] 10.4 Update saved items UI
  - Ensure save/unsave works with real auth
  - Update saved items page to use session
  - Handle authentication requirements
  - Test full saved items flow
  - _Requirements: 10.7_

---

## 11. Mock Authentication Removal

- [ ] 11.1 Remove mock authentication files
  - Delete `/src/lib/mock-auth.ts`
  - Delete `/src/data/users.ts` (if exists)
  - Remove any mock user data
  - _Requirements: 17.1, 17.2_

- [ ] 11.2 Remove localStorage authentication
  - Remove localStorage auth logic from components
  - Remove any client-side auth storage
  - Verify no localStorage references remain
  - _Requirements: 17.4_

- [ ] 11.3 Update all components using mock auth
  - Search codebase for mock auth imports
  - Replace with NextAuth hooks
  - Test each updated component
  - _Requirements: 17.3_

- [ ] 11.4 Verify no mock auth references remain
  - Search for "mock-auth" in codebase
  - Search for "mockUser" in codebase
  - Search for localStorage auth patterns
  - Clean up any remaining references
  - _Requirements: 17.5_

---

## 12. Testing and Validation

- [ ] 12.1 Test registration flow
  - Test successful registration with valid data
  - Test duplicate email rejection
  - Test password validation (too short, no letter, no number)
  - Test auto-login after registration
  - Test rate limiting (6th attempt fails)
  - _Requirements: 19.1, 19.4_

- [ ] 12.2 Test login flow
  - Test successful login with valid credentials
  - Test invalid email error
  - Test invalid password error
  - Test redirect to intended page
  - Test session persistence across refreshes
  - _Requirements: 19.2, 19.3, 19.5_

- [ ] 12.3 Test logout flow
  - Test logout clears session
  - Test redirect to homepage
  - Test cannot access protected routes after logout
  - _Requirements: 19.5_

- [ ] 12.4 Test password reset flow
  - Set up email testing (use onboarding@resend.dev or MailHog)
  - Test forgot password email sending
  - Test email delivery and verify formatting
  - Test reset link functionality
  - Test multiple reset requests (old tokens invalidated)
  - Test token expiration (after 1 hour)
  - Test invalid token handling
  - Test successful password reset
  - Test old password no longer works
  - Test all sessions invalidated after reset
  - Test rate limiting on forgot password
  - _Requirements: 19.8, 19.9, 19.10_

- [ ] 12.5 Test route protection
  - Test unauthenticated redirect to login
  - Test authenticated access to protected pages
  - Test API 401 responses without auth
  - Test redirect to intended page after login
  - _Requirements: 19.6, 19.7_

- [ ] 12.6 Test saved items integration
  - Test saving items with real authentication
  - Test user-specific saved items
  - Test saved items persist after logout/login
  - Test API protection on saved items endpoints
  - _Requirements: 19.7_

- [ ] 12.7 Test session management
  - Test session persists for 30 days
  - Test session updates every 24 hours
  - Test session invalidation on password reset
  - Test logout invalidates session
  - _Requirements: 19.5_

- [ ] 12.8 Test rate limiting
  - Test registration rate limit (5 per 10 min)
  - Test forgot password rate limit (10 per 10 min)
  - Test rate limit resets after window
  - Test different IPs have separate limits
  - _Requirements: 16.7_

---

## 13. Security Validation

- [ ] 13.1 Validate password security
  - Verify passwords are hashed with bcrypt
  - Verify salt rounds = 10
  - Verify plain passwords never stored
  - Verify passwords never logged
  - _Requirements: 2.1-2.3_

- [ ] 13.2 Validate session security
  - Verify HTTP-only cookies are set
  - Verify secure flag in production
  - Verify SameSite=Lax
  - Verify 30-day expiration
  - Verify database sessions (revocable)
  - _Requirements: 8.1-8.4_

- [ ] 13.3 Validate token security
  - Verify reset tokens are hashed (SHA-256)
  - Verify tokens are single-use
  - Verify 1-hour expiration
  - Verify secure random generation
  - _Requirements: 6.3, 6.9_

- [ ] 13.4 Validate error messages
  - Verify generic login errors
  - Verify no email enumeration
  - Verify no sensitive data in errors
  - Verify detailed errors only in server logs
  - _Requirements: 16.1, 16.2_

- [ ] 13.5 Validate input sanitization
  - Verify all inputs validated with Zod
  - Verify email sanitization
  - Verify SQL injection prevention (Prisma)
  - Verify XSS prevention
  - _Requirements: 16.4, 16.5_

---

## 14. Documentation

- [ ] 14.1 Update README with Phase 3 section
  - Add "Phase 3: Authentication" section
  - Document NextAuth.js setup
  - Document environment variables
  - Document authentication flows
  - _Requirements: 20.1, 20.2_

- [ ] 14.2 Document Resend configuration
  - Add Resend setup instructions
  - Document API key generation
  - Document development setup (onboarding@resend.dev)
  - Document production setup (domain verification required)
  - Document email testing options (Resend/MailHog/personal email)
  - Add troubleshooting for email delivery issues
  - _Requirements: 20.3_

- [ ] 14.3 Document authentication flows
  - Add registration flow diagram
  - Add login flow diagram
  - Add password reset flow diagram
  - Document session management
  - _Requirements: 20.4_

- [ ] 14.4 Document protected routes
  - List all protected page routes
  - List all protected API routes
  - Document middleware configuration
  - Document how to add new protected routes
  - _Requirements: 20.5_

- [ ] 14.5 Document password requirements
  - Document minimum 8 characters
  - Document 1 letter + 1 number requirement
  - Document maximum 128 characters
  - Add examples of valid passwords
  - _Requirements: 20.6_

- [ ] 14.6 Update API documentation
  - Document authentication requirements
  - Document session headers
  - Document 401 error responses
  - Update OpenAPI spec if exists
  - _Requirements: 20.8_

---

## 15. Performance Optimization

- [ ] 15.1 Optimize database queries
  - Verify indexes on email, sessionToken, token
  - Test query performance with EXPLAIN
  - Optimize user lookup queries
  - Verify Prisma connection pooling
  - _Requirements: Performance_

- [ ] 15.2 Test authentication performance
  - Measure login response time (< 2 seconds)
  - Measure registration response time (< 2 seconds)
  - Measure session validation time (< 100ms)
  - Measure password reset email time (< 5 minutes)
  - _Requirements: Performance_

---

## 16. Final Integration Testing

- [ ] 16.1 End-to-end user journey testing
  - Complete registration → login → save item → logout → login → view saved
  - Complete forgot password → reset → login with new password
  - Test all protected routes with authentication
  - Test all public routes without authentication
  - _Requirements: 19.1-19.10_

- [ ] 16.2 Cross-browser testing
  - Test in Chrome (latest)
  - Test in Firefox (latest)
  - Test in Safari (latest)
  - Test on mobile browsers (iOS Safari, Chrome Mobile)
  - _Requirements: Browser Compatibility_

- [ ] 16.3 Production readiness checklist
  - Verify all environment variables documented
  - Verify NEXTAUTH_SECRET is secure
  - Verify Resend API key is configured
  - Verify database migrations are applied
  - Verify all tests pass
  - Verify no console errors
  - Verify no mock auth remains
  - _Requirements: Success Criteria_

---

## Task Dependencies

### Critical Path
1. Setup (1.1-1.2) → Database (2.1-2.3) → Utilities (3.1-3.3) → NextAuth Config (4.1-4.5) → Registration (5.1-5.4) → Login (6.1-6.3) → Route Protection (9.1-9.4) → Testing (12.1-12.8)

### Parallel Tracks
- Password Reset (7.1-7.7) can be done after utilities (3.1-3.3)
- Session Management (8.1-8.4) can be done after NextAuth config (4.1-4.5)
- UI Updates (10.1-10.4) can be done after core auth is working
- Mock Removal (11.1-11.4) should be done after all features work
- Documentation (14.1-14.6) can be done throughout

### Prerequisites
- Phase 2 database integration must be complete
- Neon PostgreSQL database must be operational
- Resend account and API key required

---

## Estimated Timeline

- **Setup & Database**: 2-3 hours
- **Core Auth (Registration + Login)**: 4-6 hours
- **Password Reset**: 3-4 hours
- **Route Protection**: 2-3 hours
- **Session Management**: 2-3 hours
- **UI Updates**: 2-3 hours
- **Mock Removal**: 1-2 hours
- **Testing**: 3-4 hours
- **Documentation**: 2-3 hours

**Total**: 21-31 hours (3-5 days of focused work)

---

## Success Criteria

Phase 3 is complete when:

1. ✅ Users can register with email/password
2. ✅ Users can login and logout securely
3. ✅ Password reset via email works
4. ✅ Protected routes redirect unauthenticated users
5. ✅ API routes validate user sessions
6. ✅ Saved items use real user authentication
7. ✅ Mock authentication is completely removed
8. ✅ All security requirements are met
9. ✅ Rate limiting protects auth endpoints
10. ✅ Database sessions are revocable
11. ✅ Reset tokens are hashed in database
12. ✅ All tests pass
13. ✅ Documentation is complete
14. ✅ System is ready for Phase 4
