# Phase 3: Authentication - Requirements Document

## Introduction

This document outlines the requirements for Phase 3 of the Pome web application, which focuses on implementing real user authentication to replace the mock authentication system from Phase 1. This phase will implement NextAuth.js with JWT-based sessions, secure password management with bcrypt, user registration and login flows, password reset functionality via email, and comprehensive session management with HTTP-only cookies.

The authentication system will provide instant access upon registration (no email verification required in Phase 3), use Resend for transactional emails, and implement proper middleware protection for both pages and API routes. Rate limiting is intentionally deferred to Phase 5 to maintain focus on core authentication functionality.

## Glossary

- **NextAuth.js**: Authentication library for Next.js applications providing session management and authentication flows
- **JWT (JSON Web Token)**: Compact, URL-safe token format used for securely transmitting information between parties
- **bcrypt**: Password hashing function designed for secure password storage with built-in salt
- **Session**: Server-side representation of an authenticated user's login state
- **HTTP-only Cookie**: Cookie that cannot be accessed via JavaScript, providing protection against XSS attacks
- **Resend**: Email service provider optimized for Next.js applications with React Email support
- **Middleware**: Next.js function that runs before a request is completed, used for authentication checks
- **CSRF (Cross-Site Request Forgery)**: Attack that forces authenticated users to execute unwanted actions
- **Salt Rounds**: Number of iterations used in bcrypt hashing algorithm (higher = more secure but slower)
- **Password Reset Token**: Time-limited, single-use token sent via email to verify password reset requests
- **Session Token**: Unique identifier stored in cookie to maintain user authentication state
- **Protected Route**: Page or API endpoint that requires authentication to access
- **Credentials Provider**: NextAuth.js authentication method using email and password

## Requirements

### Requirement 1: NextAuth.js Setup and Configuration

**User Story:** As a developer, I want to set up NextAuth.js with JWT strategy, so that the application has a secure and maintainable authentication system.

#### Acceptance Criteria

1. THE Pome App SHALL install next-auth as a dependency
2. THE Pome App SHALL create NextAuth configuration at `/src/app/api/auth/[...nextauth]/route.ts`
3. THE Pome App SHALL configure JWT strategy with 30-day expiration
4. THE Pome App SHALL store session tokens in HTTP-only cookies
5. THE Pome App SHALL configure NEXTAUTH_URL and NEXTAUTH_SECRET environment variables
6. THE Pome App SHALL create authentication options with Credentials provider
7. THE Pome App SHALL integrate NextAuth with existing Prisma User model

### Requirement 2: Password Security and Hashing

**User Story:** As a security-conscious developer, I want passwords to be securely hashed, so that user credentials are protected even if the database is compromised.

#### Acceptance Criteria

1. THE Pome App SHALL use bcrypt for password hashing with 10 salt rounds
2. THE Pome App SHALL never store plain-text passwords in the database
3. THE Pome App SHALL validate passwords against hashed values during login
4. THE Pome App SHALL enforce minimum password length of 8 characters
5. THE Pome App SHALL require at least one letter and one number in passwords
6. THE Pome App SHALL allow passwords up to 128 characters for password manager compatibility

### Requirement 3: User Registration Flow

**User Story:** As a new user, I want to create an account with email and password, so that I can access personalized features immediately.

#### Acceptance Criteria

1. THE Pome App SHALL implement POST `/api/auth/register` endpoint
2. WHEN a user submits registration form, THE Pome App SHALL validate email format
3. WHEN a user submits registration form, THE Pome App SHALL validate password requirements
4. THE Pome App SHALL check for existing email before creating account
5. WHEN email already exists, THE Pome App SHALL return 409 Conflict error
6. WHEN registration succeeds, THE Pome App SHALL create user with hashed password
7. WHEN registration succeeds, THE Pome App SHALL automatically log in the user
8. THE Pome App SHALL NOT require email verification for immediate access
9. THE Pome App SHALL set emailVerified field to null for new users

### Requirement 4: User Login Flow

**User Story:** As a registered user, I want to log in with my email and password, so that I can access my saved items and profile.

#### Acceptance Criteria

1. THE Pome App SHALL implement login via NextAuth Credentials provider
2. WHEN a user submits login credentials, THE Pome App SHALL validate email format
3. WHEN a user submits login credentials, THE Pome App SHALL verify password against hash
4. WHEN credentials are invalid, THE Pome App SHALL return "Invalid email or password" message
5. THE Pome App SHALL NOT reveal whether email exists or password is wrong
6. WHEN login succeeds, THE Pome App SHALL create session with 30-day expiration
7. WHEN login succeeds, THE Pome App SHALL store session token in HTTP-only cookie
8. WHEN login succeeds, THE Pome App SHALL redirect user to intended destination or homepage

### Requirement 5: User Logout Flow

**User Story:** As a logged-in user, I want to log out of my account, so that my session is terminated and my data is secure.

#### Acceptance Criteria

1. THE Pome App SHALL implement logout via NextAuth signOut function
2. WHEN a user logs out, THE Pome App SHALL invalidate the session token
3. WHEN a user logs out, THE Pome App SHALL clear the session cookie
4. WHEN a user logs out, THE Pome App SHALL redirect to homepage
5. THE Pome App SHALL provide logout button in user menu

### Requirement 6: Password Reset Flow

**User Story:** As a user who forgot my password, I want to reset it via email, so that I can regain access to my account.

#### Acceptance Criteria

1. THE Pome App SHALL implement POST `/api/auth/forgot-password` endpoint
2. WHEN a user requests password reset, THE Pome App SHALL validate email format
3. WHEN email exists, THE Pome App SHALL generate unique reset token with 1-hour expiration
4. WHEN email exists, THE Pome App SHALL send password reset email via Resend
5. WHEN email does not exist, THE Pome App SHALL return success message to prevent email enumeration
6. THE Pome App SHALL implement POST `/api/auth/reset-password` endpoint
7. WHEN a user submits reset form, THE Pome App SHALL validate token and expiration
8. WHEN token is valid, THE Pome App SHALL update password with new hash
9. WHEN token is valid, THE Pome App SHALL invalidate the reset token
10. WHEN password reset succeeds, THE Pome App SHALL redirect to login page

### Requirement 7: Prisma Schema Updates

**User Story:** As a developer, I want the database schema to support NextAuth.js, so that sessions and authentication data are properly stored.

#### Acceptance Criteria

1. THE Pome App SHALL add emailVerified DateTime field to User model
2. THE Pome App SHALL create Account model for OAuth providers (future use)
3. THE Pome App SHALL create Session model for NextAuth session management
4. THE Pome App SHALL create VerificationToken model for password reset tokens
5. THE Pome App SHALL add indexes on sessionToken and email fields
6. THE Pome App SHALL create migration for schema changes
7. THE Pome App SHALL maintain backward compatibility with existing User data

### Requirement 8: Session Management

**User Story:** As a logged-in user, I want my session to persist across browser sessions, so that I don't have to log in frequently.

#### Acceptance Criteria

1. THE Pome App SHALL store JWT tokens in HTTP-only cookies
2. THE Pome App SHALL set session expiration to 30 days
3. THE Pome App SHALL validate session on every protected request
4. WHEN session expires, THE Pome App SHALL redirect user to login page
5. THE Pome App SHALL include user ID, email, and name in session data
6. THE Pome App SHALL provide getServerSession helper for server components
7. THE Pome App SHALL provide useSession hook for client components

### Requirement 9: Protected Routes - Pages

**User Story:** As a developer, I want to protect pages that require authentication, so that only logged-in users can access them.

#### Acceptance Criteria

1. THE Pome App SHALL implement Next.js middleware for route protection
2. THE Pome App SHALL protect `/clinics/*` routes
3. THE Pome App SHALL protect `/treatments` list route
4. THE Pome App SHALL protect `/search/*` routes
5. THE Pome App SHALL protect `/saved/*` routes
6. THE Pome App SHALL protect `/profile/*` routes
7. WHEN unauthenticated user accesses protected route, THE Pome App SHALL redirect to `/login`
8. WHEN redirecting to login, THE Pome App SHALL preserve intended destination URL
9. WHEN login succeeds, THE Pome App SHALL redirect to preserved destination

### Requirement 10: Protected Routes - API Endpoints

**User Story:** As a developer, I want to protect API endpoints that require authentication, so that user data is secure.

#### Acceptance Criteria

1. THE Pome App SHALL create requireAuth helper function for API routes
2. THE Pome App SHALL protect POST `/api/saved` endpoint
3. THE Pome App SHALL protect GET `/api/saved` endpoint
4. THE Pome App SHALL protect DELETE `/api/saved/[id]` endpoint
5. WHEN unauthenticated request is made, THE Pome App SHALL return 401 Unauthorized
6. THE Pome App SHALL extract user ID from session for database queries
7. THE Pome App SHALL replace mock user ID with real session user ID

### Requirement 11: Email Service Integration

**User Story:** As a developer, I want to integrate Resend for sending emails, so that users can receive password reset instructions.

#### Acceptance Criteria

1. THE Pome App SHALL install resend package as dependency
2. THE Pome App SHALL configure RESEND_API_KEY environment variable
3. THE Pome App SHALL create email utility at `/src/lib/email.ts`
4. THE Pome App SHALL implement sendPasswordResetEmail function
5. THE Pome App SHALL use React Email for email templates (optional)
6. THE Pome App SHALL include reset link with token in password reset email
7. THE Pome App SHALL set email sender as "Pome <noreply@pome.com>"
8. WHEN email sending fails, THE Pome App SHALL log error and return generic success message

### Requirement 12: Authentication Context Updates

**User Story:** As a developer, I want to update the auth context to use NextAuth, so that components can access real authentication state.

#### Acceptance Criteria

1. THE Pome App SHALL update `/src/contexts/auth-context.tsx` to use NextAuth
2. THE Pome App SHALL replace mock login with NextAuth signIn
3. THE Pome App SHALL replace mock logout with NextAuth signOut
4. THE Pome App SHALL use useSession hook for authentication state
5. THE Pome App SHALL provide isAuthenticated boolean based on session
6. THE Pome App SHALL provide user object from session data
7. THE Pome App SHALL maintain backward compatibility with existing component usage

### Requirement 13: Registration Form Component

**User Story:** As a new user, I want a registration form, so that I can create an account easily.

#### Acceptance Criteria

1. THE Pome App SHALL create registration form component at `/src/components/forms/register-form.tsx`
2. THE Pome App SHALL include email input field with validation
3. THE Pome App SHALL include password input field with visibility toggle
4. THE Pome App SHALL include confirm password field
5. THE Pome App SHALL display password requirements below password field
6. THE Pome App SHALL validate passwords match before submission
7. THE Pome App SHALL display validation errors inline
8. THE Pome App SHALL disable submit button during registration request
9. THE Pome App SHALL display success message and redirect on successful registration
10. THE Pome App SHALL display error message on registration failure

### Requirement 14: Login Form Updates

**User Story:** As a registered user, I want an updated login form that uses real authentication, so that I can access my account.

#### Acceptance Criteria

1. THE Pome App SHALL update existing login form to use NextAuth signIn
2. THE Pome App SHALL remove mock credential references
3. THE Pome App SHALL add "Forgot password?" link to login form
4. THE Pome App SHALL display authentication errors from NextAuth
5. THE Pome App SHALL redirect to intended destination after successful login
6. THE Pome App SHALL maintain existing form styling and validation

### Requirement 15: Password Reset Form Components

**User Story:** As a user who forgot my password, I want password reset forms, so that I can recover my account.

#### Acceptance Criteria

1. THE Pome App SHALL create forgot password form at `/src/components/forms/forgot-password-form.tsx`
2. THE Pome App SHALL create reset password form at `/src/components/forms/reset-password-form.tsx`
3. THE Pome App SHALL create forgot password page at `/src/app/[locale]/forgot-password/page.tsx`
4. THE Pome App SHALL create reset password page at `/src/app/[locale]/reset-password/page.tsx`
5. THE Pome App SHALL validate email format in forgot password form
6. THE Pome App SHALL display success message after reset email sent
7. THE Pome App SHALL validate token from URL in reset password page
8. THE Pome App SHALL display password requirements in reset form
9. THE Pome App SHALL redirect to login after successful password reset

### Requirement 16: Error Handling and Security

**User Story:** As a security-conscious developer, I want proper error handling for authentication, so that the system is secure and user-friendly.

#### Acceptance Criteria

1. THE Pome App SHALL return generic error messages to prevent information disclosure
2. THE Pome App SHALL log detailed errors server-side for debugging
3. THE Pome App SHALL implement CSRF protection via NextAuth
4. THE Pome App SHALL validate all authentication inputs with Zod
5. THE Pome App SHALL sanitize email inputs to prevent injection attacks
6. THE Pome App SHALL use secure cookie settings (httpOnly, secure in production, sameSite)
7. THE Pome App SHALL handle database errors gracefully in authentication flows

### Requirement 17: Mock Authentication Removal

**User Story:** As a developer, I want to remove mock authentication code, so that the codebase is clean and maintainable.

#### Acceptance Criteria

1. THE Pome App SHALL remove `/src/lib/mock-auth.ts` file
2. THE Pome App SHALL remove mock user data from `/src/data/users.ts`
3. THE Pome App SHALL update all components using mock auth to use NextAuth
4. THE Pome App SHALL remove localStorage-based authentication logic
5. THE Pome App SHALL verify no references to mock auth remain in codebase

### Requirement 18: Environment Configuration

**User Story:** As a developer, I want clear environment variable documentation, so that authentication can be configured correctly.

#### Acceptance Criteria

1. THE Pome App SHALL update `.env.example` with NextAuth variables
2. THE Pome App SHALL document NEXTAUTH_URL configuration
3. THE Pome App SHALL document NEXTAUTH_SECRET generation instructions
4. THE Pome App SHALL document RESEND_API_KEY configuration
5. THE Pome App SHALL document EMAIL_FROM configuration
6. THE Pome App SHALL add comments explaining each authentication variable

### Requirement 19: Testing and Validation

**User Story:** As a developer, I want to validate the authentication system works correctly, so that users have a reliable experience.

#### Acceptance Criteria

1. THE Pome App SHALL allow successful registration with valid credentials
2. THE Pome App SHALL allow successful login with registered credentials
3. THE Pome App SHALL prevent login with incorrect password
4. THE Pome App SHALL prevent registration with existing email
5. THE Pome App SHALL maintain session across page refreshes
6. THE Pome App SHALL redirect unauthenticated users from protected routes
7. THE Pome App SHALL allow authenticated users to access protected routes
8. THE Pome App SHALL successfully send password reset emails
9. THE Pome App SHALL allow password reset with valid token
10. THE Pome App SHALL reject password reset with expired token

### Requirement 20: Documentation Updates

**User Story:** As a developer, I want updated documentation for Phase 3, so that the authentication system is well-documented.

#### Acceptance Criteria

1. THE Pome App SHALL add "Phase 3: Authentication" section to README.md
2. THE Pome App SHALL document NextAuth.js setup instructions
3. THE Pome App SHALL document Resend configuration steps
4. THE Pome App SHALL document authentication flow diagrams
5. THE Pome App SHALL document protected routes configuration
6. THE Pome App SHALL document password requirements
7. THE Pome App SHALL document session management behavior
8. THE Pome App SHALL update API documentation with authentication requirements

