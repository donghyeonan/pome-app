# Implementation Plan

- [x] 1. Configure Google OAuth credentials and environment
  - Set up Google Cloud Project and OAuth 2.0 credentials
  - Configure authorized origins and redirect URIs for dev and prod
  - Add environment variables to `.env` and `.env.example`
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 2. Update NextAuth configuration
- [x] 2.1 Add GoogleProvider to NextAuth config
  - Import GoogleProvider from `next-auth/providers/google`
  - Add GoogleProvider to providers array with client ID and secret
  - _Requirements: 4.1, 1.1_

- [x] 2.2 Implement signIn callback with account linking logic
  - Check if user exists by email
  - Create Account record for existing users (link Google account)
  - Set emailVerified for both new and existing users
  - Update user object to avoid race conditions
  - _Requirements: 2.1, 2.2, 1.3, 1.5, 7.5_

- [x] 2.3 Update jwt callback
  - Add user data to token (id, email, name)
  - Remove database update logic (handled in signIn callback)
  - _Requirements: 8.2_

- [x] 2.4 Add pages configuration
  - Configure signIn page to redirect to `/login`
  - Configure error page to redirect to `/login`
  - _Requirements: 5.1, 5.2_

- [x] 2.5 Write unit tests for NextAuth callbacks
  - Test signIn callback account linking logic
  - Test emailVerified is set correctly
  - Test jwt callback adds user data to token
  - _Requirements: 2.1, 1.3, 8.2_

- [ ] 3. Create GoogleSignInButton component
- [x] 3.1 Implement GoogleSignInButton component
  - Create client component with signIn function
  - Add loading state management
  - Implement Google branding (official logo SVG, colors, "Sign in with Google" text)
  - Add proper styling with white background and gray hover
  - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [x] 3.2 Write unit tests for GoogleSignInButton
  - Test button renders with correct text and icon
  - Test button calls signIn('google') when clicked
  - Test loading state during OAuth redirect
  - Test button is disabled during loading
  - _Requirements: 3.4, 3.5_

- [x] 4. Update login page
- [x] 4.1 Add GoogleSignInButton to login page
  - Import GoogleSignInButton component
  - Place button above existing LoginForm
  - Add "or" divider between Google and email/password sections
  - _Requirements: 3.1, 3.3_

- [ ] 5. Test OAuth flow end-to-end
- [ ] 5.1 Test new user registration via Google
  - Verify user can click "Sign in with Google" button
  - Verify redirect to Google OAuth consent screen
  - Verify new user account is created with email and name
  - Verify emailVerified is set
  - Verify Account record is created
  - Verify session is created and redirects to homepage
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 5.2 Test existing user account linking
  - Create user with email/password
  - Sign in with Google using same email
  - Verify Google account is linked to existing user
  - Verify Account record is created with provider "google"
  - Verify session is created for existing user
  - Verify no duplicate user is created
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ] 5.3 Test repeat sign-ins
  - Sign in with Google multiple times
  - Verify no duplicate Account records are created
  - Verify authentication works correctly
  - _Requirements: 2.5_

- [ ] 5.4 Test session management
  - Verify Google sessions have 30-day expiration
  - Verify session includes user ID
  - Verify logout invalidates Google sessions
  - Verify protected routes work with Google auth
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [ ] 5.5 Test error scenarios
  - Test user cancels OAuth (should redirect to login)
  - Test missing email from Google (should prevent account creation)
  - Verify errors are logged
  - _Requirements: 5.1, 5.3, 5.4_

- [ ]* 6. Write property-based tests
- [ ]* 6.1 Property 1: Google sign-in creates user with verified email
  - **Property 1: Google sign-in creates user with verified email**
  - **Validates: Requirements 1.3**
  - Generate random Google profiles
  - Verify emailVerified is set for all new users

- [ ]* 6.2 Property 2: Google sign-in creates Account record
  - **Property 2: Google sign-in creates Account record**
  - **Validates: Requirements 1.5, 2.2**
  - Generate random Google sign-ins
  - Verify Account record exists with correct provider and providerAccountId

- [ ]* 6.3 Property 3: Account linking matches by email
  - **Property 3: Account linking matches by email**
  - **Validates: Requirements 2.1**
  - Generate random existing users and Google profiles with matching emails
  - Verify Google account links to existing user by userId

- [ ]* 6.4 Property 4: Google sessions match credentials sessions
  - **Property 4: Google sessions match credentials sessions**
  - **Validates: Requirements 4.3, 8.1, 8.2**
  - Generate random sessions from both auth methods
  - Verify session structure is identical

- [ ]* 6.5 Property 6: OAuth tokens are stored securely
  - **Property 6: OAuth tokens are stored securely**
  - **Validates: Requirements 7.2, 7.3**
  - Generate random OAuth tokens
  - Verify tokens are never exposed in session objects

- [ ]* 6.6 Property 10: Repeat sign-ins don't create duplicates
  - **Property 10: Repeat sign-ins don't create duplicates**
  - **Validates: Requirements 2.5**
  - Generate random users and sign in multiple times
  - Verify only one Account record exists per provider

- [ ] 7. Update documentation
- [ ] 7.1 Update README with Google OAuth setup instructions
  - Document Google Cloud Console setup steps
  - Document environment variable configuration
  - Add troubleshooting section
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 7.2 Update .env.example with required variables
  - Add NEXTAUTH_URL
  - Add NEXTAUTH_SECRET with generation command
  - Add GOOGLE_CLIENT_ID
  - Add GOOGLE_CLIENT_SECRET
  - _Requirements: 6.1, 6.2_

- [ ] 8. Final verification and deployment preparation
  - Ensure all tests pass, ask the user if questions arise
  - Verify OAuth works in both dev and prod environments
  - Verify rollback plan is documented
  - _Requirements: All_
