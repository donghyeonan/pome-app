# Design Document

## Overview

This document describes the technical design for integrating Google OAuth authentication into the Pome application. The implementation leverages NextAuth.js's built-in GoogleProvider to add "Continue with Google" functionality to the login page, with custom account linking based on email addresses. This is a minimal Phase 4 MVP focused on core functionality without over-engineering.

**Important Context:** Because we use JWT sessions (required for the Credentials provider), we must implement custom account linking logic in the `signIn` callback. NextAuth's automatic account linking only works with database sessions. This custom logic ensures that when a user signs in with Google using an email that already exists in our system, their Google account is linked to their existing user account rather than creating a duplicate.

**Race Condition Prevention:** To avoid timing issues where the jwt callback tries to update a user that doesn't exist yet, we set `emailVerified` directly on the user object in the signIn callback. For new users, NextAuth will create the User record with this value. For existing users, we update the database immediately in the signIn callback before the jwt callback runs.

The design prioritizes simplicity and reliability by implementing minimal custom logic only where necessary, and deferring advanced features (account management UI, custom error pages, email notifications) to future phases.

## Architecture

### High-Level Flow

```
┌─────────────┐
│ Login Page  │
│             │
│ [Continue   │
│  with       │──────┐
│  Google]    │      │
│             │      │
│ [Email/Pass]│      │
└─────────────┘      │
                     │
                     ▼
            ┌────────────────┐
            │ NextAuth.js    │
            │ GoogleProvider │
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────┐
            │ Google OAuth   │
            │ Consent Screen │
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────┐
            │ OAuth Callback │
            │ /api/auth/     │
            │ callback/google│
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────────────┐
            │ signIn Callback        │
            │ - Check if email exists│
            │ - If YES: Link account │
            │   to existing user     │
            │ - If NO: Let NextAuth  │
            │   create new user      │
            │ - Set emailVerified    │
            └────────┬───────────────┘
                     │
                     ▼
            ┌────────────────┐
            │ jwt Callback   │
            │ - Add user data│
            │ - Set verified │
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────┐
            │ Homepage       │
            │ (Authenticated)│
            └────────────────┘
```

### Component Architecture

```
┌──────────────────────────────────────────────────┐
│                  Presentation Layer               │
├──────────────────────────────────────────────────┤
│  LoginPage                                        │
│  ├── LoginForm (email/password)                  │
│  └── GoogleSignInButton                          │
│      └── onClick: signIn('google')               │
└──────────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────┐
│              Authentication Layer                 │
├──────────────────────────────────────────────────┤
│  NextAuth.js (src/lib/auth.ts)                   │
│  ├── GoogleProvider                              │
│  │   ├── clientId                                │
│  │   └── clientSecret                            │
│  ├── CredentialsProvider (existing)              │
│  └── Callbacks                                   │
│      ├── signIn (set emailVerified)              │
│      ├── jwt (add user data to token)            │
│      └── session (add user data to session)      │
└──────────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────┐
│                  Data Layer                       │
├──────────────────────────────────────────────────┤
│  Prisma Database                                  │
│  ├── User (existing)                             │
│  │   ├── id, email, name                         │
│  │   ├── emailVerified                           │
│  │   └── passwordHash (optional for Google)      │
│  ├── Account (existing)                          │
│  │   ├── provider: "google"                      │
│  │   ├── providerAccountId                       │
│  │   ├── access_token, refresh_token             │
│  │   └── userId (foreign key)                    │
│  └── Session (JWT-based, not in DB)              │
└──────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. GoogleSignInButton Component

**Location:** `src/components/auth/google-signin-button.tsx`

**Purpose:** Provides a clickable button that initiates the Google OAuth flow.

**Interface:**
```typescript
export function GoogleSignInButton(): JSX.Element
```

**Implementation:**
```typescript
'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          {/* Official Google "G" logo */}
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      Sign in with Google
    </Button>
  );
}
```

**Dependencies:**
- `next-auth/react` for `signIn` function
- `@/components/ui/button` for Button component
- `lucide-react` for Loader2 icon
- Official Google "G" logo SVG (inline)

**Branding Compliance:**
- Uses "Sign in with Google" text (per Google's branding guidelines)
- Implements official Google colors and logo
- White background with gray hover state
- Reference: [Google Identity Branding Guidelines](https://developers.google.com/identity/branding-guidelines)

### 2. NextAuth Configuration Updates

**Location:** `src/lib/auth.ts`

**Changes:**
```typescript
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      // ... existing credentials provider
    })
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // Custom account linking for Google OAuth
      // Required because we use JWT sessions (not database sessions)
      if (account?.provider === "google") {
        if (!user.email) {
          // Google must provide email
          return false;
        }

        // Check if user with this email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        });

        if (existingUser) {
          // User exists - link Google account if not already linked
          const hasGoogleAccount = existingUser.accounts.some(
            acc => acc.provider === "google"
          );

          if (!hasGoogleAccount) {
            // Create Account link to existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              }
            });
          }

          // Set email as verified for existing user
          if (!existingUser.emailVerified) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { emailVerified: new Date() }
            });
          }

          // IMPORTANT: Update user object for JWT token
          user.id = existingUser.id;
          user.emailVerified = new Date();
        } else {
          // New user - NextAuth will create User and Account
          // Set emailVerified in user object so NextAuth creates user with it
          user.emailVerified = new Date();
        }
      }
      return true;
    },
    
    async jwt({ token, user, account }) {
      // Add user data to token on sign-in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    }
  },
  
  pages: {
    signIn: '/login',
    error: '/login', // Redirect OAuth errors back to login page
  },
  
  // ... rest of existing configuration
};
```

**Key Points:**
- GoogleProvider added to providers array
- **Custom account linking logic in signIn callback** (required for JWT sessions)
- Checks if user exists by email before creating new user
- Links Google account to existing user if email matches
- Sets emailVerified for both new and existing users by setting it on the user object (avoiding race conditions)
- Prevents duplicate users with same email
- jwt callback simplified - only adds user data to token (no database updates)
- pages configuration added to redirect OAuth errors to login page

### 3. Login Page Updates

**Location:** `src/app/[locale]/login/page.tsx`

**Changes:**
- Import GoogleSignInButton component
- Add button above existing login form
- Add "or" divider between Google and email/password sections

**Layout Structure:**
```tsx
<div className="space-y-4">
  <GoogleSignInButton />
  
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-background px-2 text-muted-foreground">
        or
      </span>
    </div>
  </div>
  
  <LoginForm />
</div>
```

**Note:** The "or" text should be added to translation files if internationalization is needed for this divider.

### 4. Environment Configuration

**Location:** `.env` and `.env.example`

**Required Variables:**
```bash
# NextAuth Configuration (Required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here  # Generate: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**Validation:**
- Application should validate these variables exist at startup
- NextAuth will throw errors if credentials are missing
- `NEXTAUTH_URL` must match the deployment environment (localhost for dev, production URL for prod)
- `NEXTAUTH_SECRET` should be a secure random string (minimum 32 characters)

## Data Models

### Existing Schema (No Changes Required)

The existing Prisma schema already supports Google OAuth through the Account model:

```prisma
model User {
  id                String      @id @default(cuid())
  email             String      @unique
  passwordHash      String?     // Optional for Google-only users
  name              String?
  emailVerified     DateTime?   // Set by Google OAuth
  // ... other fields
  
  accounts       Account[]
  sessions       Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String  // "oauth" for Google
  provider          String  // "google"
  providerAccountId String  // Google user ID
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}
```

**Key Points:**
- No database migration needed
- Account model already exists from Phase 3
- User.passwordHash is nullable (supports Google-only users)
- User.emailVerified is set during Google sign-in
- Account table stores OAuth tokens and provider information

### Account Linking Logic

**Important:** Because we use JWT sessions (required for Credentials provider), we must implement custom account linking logic. NextAuth's automatic account linking only works with database sessions.

1. **New User Flow:**
   - User signs in with Google
   - signIn callback checks if email exists in User table → NO
   - signIn callback sets `user.emailVerified = new Date()` on user object
   - NextAuth creates new User record with emailVerified set
   - NextAuth creates Account record (provider: "google")
   - jwt callback adds user data to token
   - Session created

2. **Existing User Flow (Account Linking):**
   - User signs in with Google
   - signIn callback checks if email exists in User table → YES
   - signIn callback checks if Google account already linked → NO
   - signIn callback creates Account record (provider: "google", userId: existing)
   - signIn callback updates emailVerified in database if not already set
   - signIn callback updates user.id and user.emailVerified on user object
   - jwt callback adds user data to token
   - Session created with existing user's data

3. **Repeat Sign-In Flow:**
   - User signs in with Google
   - signIn callback checks if email exists → YES
   - signIn callback checks if Google account already linked → YES
   - No new Account record created
   - jwt callback adds user data to token
   - Session created

**Custom logic required** - We implement account linking in the signIn callback to handle JWT session limitations. By setting emailVerified on the user object in the signIn callback, we avoid race conditions where the jwt callback tries to update a user that doesn't exist yet.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Google sign-in creates user with verified email

*For any* new user signing in with Google, the created user account should have emailVerified set to a non-null timestamp.

**Validates: Requirements 1.3**

### Property 2: Google sign-in creates Account record

*For any* user signing in with Google (new or existing), an Account record should be created with provider "google" and the correct providerAccountId.

**Validates: Requirements 1.5, 2.2**

### Property 3: Account linking matches by email

*For any* existing user with email E, when a Google account with the same email E signs in, the Google account should be linked to that existing user (same userId).

**Validates: Requirements 2.1**

### Property 4: Google sessions match credentials sessions

*For any* user authenticated via Google, the session structure (user ID, email, expiration) should be identical to sessions created via email/password authentication.

**Validates: Requirements 4.3, 8.1, 8.2**

### Property 5: Input validation prevents malicious data

*For any* Google OAuth response containing invalid or malicious data (XSS, SQL injection attempts), the system should reject the data and prevent account creation.

**Validates: Requirements 4.5**

### Property 6: OAuth tokens are stored securely

*For any* Google OAuth flow, the access_token and refresh_token should be stored in the Account table and never exposed in session objects sent to the client.

**Validates: Requirements 7.2, 7.3**

### Property 7: Email mismatch prevents linking

*For any* account linking attempt where the Google email does not match the existing user's email, the system should not create an Account link.

**Validates: Requirements 7.5**

### Property 8: Logout invalidates Google sessions

*For any* user authenticated via Google, calling logout should invalidate the session and require re-authentication.

**Validates: Requirements 8.3**

### Property 9: Route protection works for Google auth

*For any* protected route, users authenticated via Google should have identical access permissions as users authenticated via email/password.

**Validates: Requirements 8.5**

### Property 10: Repeat sign-ins don't create duplicates

*For any* user with an existing Google Account link, subsequent Google sign-ins should not create duplicate Account records.

**Validates: Requirements 2.5**

## Error Handling

### Error Scenarios

For Phase 4 MVP, we use NextAuth's built-in error handling with custom page configuration:

1. **User Cancels OAuth:**
   - NextAuth redirects back to login page (via pages.signIn config)
   - No error message shown (user intentionally cancelled)

2. **Network Errors:**
   - NextAuth redirects to login page with error parameter (via pages.error config)
   - User can retry by clicking "Continue with Google" again

3. **Missing Email from Google:**
   - Rare scenario (Google always provides email for OAuth)
   - signIn callback returns false
   - NextAuth redirects to login page with error

4. **Invalid Credentials:**
   - Handled by Google's OAuth service
   - User never reaches our callback

**Pages Configuration:**
The `pages` configuration in NextAuth ensures all OAuth errors redirect to `/login` instead of showing NextAuth's default error page, providing a consistent user experience.

### Error Logging

All OAuth errors are automatically logged by NextAuth to console/logs:
- OAuth callback errors
- Token exchange failures
- Database errors during account creation

### Custom Error Pages (Deferred to Phase 5)

For Phase 4, we use NextAuth's default error handling. Custom error pages with user-friendly messages and retry buttons are deferred to Phase 5 when the design team finalizes error UI.

## Testing Strategy

### Unit Tests

**GoogleSignInButton Component:**
- Test button renders with correct text and icon
- Test button calls `signIn('google')` when clicked
- Test loading state during OAuth redirect
- Test button is disabled during loading

**NextAuth Configuration:**
- Test GoogleProvider is configured with correct credentials
- Test signIn callback sets emailVerified for Google users
- Test session callback includes user ID

### Property-Based Tests

We will use **fast-check** (JavaScript/TypeScript property-based testing library) to verify correctness properties.

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with property number and requirement reference

**Property Test Examples:**

**Property 1: Google sign-in creates user with verified email**
```typescript
// Feature: google-oauth, Property 1: Google sign-in creates user with verified email
// Validates: Requirements 1.3
it('should set emailVerified for all Google sign-ins', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.record({
        email: fc.emailAddress(),
        name: fc.string({ minLength: 1, maxLength: 100 }),
        googleId: fc.uuid(),
      }),
      async (googleProfile) => {
        // Simulate Google OAuth callback
        const user = await createUserFromGoogle(googleProfile);
        
        // Property: emailVerified must be set
        expect(user.emailVerified).not.toBeNull();
        expect(user.emailVerified).toBeInstanceOf(Date);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Property 3: Account linking matches by email**
```typescript
// Feature: google-oauth, Property 3: Account linking matches by email
// Validates: Requirements 2.1
it('should link Google accounts to existing users by email', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.record({
        email: fc.emailAddress(),
        existingUserId: fc.uuid(),
        googleId: fc.uuid(),
      }),
      async ({ email, existingUserId, googleId }) => {
        // Create existing user
        await createUser({ id: existingUserId, email });
        
        // Simulate Google sign-in with same email
        const account = await linkGoogleAccount({ email, googleId });
        
        // Property: Account should link to existing user
        expect(account.userId).toBe(existingUserId);
        expect(account.provider).toBe('google');
      }
    ),
    { numRuns: 100 }
  );
});
```

**Property 6: OAuth tokens are stored securely**
```typescript
// Feature: google-oauth, Property 6: OAuth tokens are stored securely
// Validates: Requirements 7.2, 7.3
it('should never expose tokens in session', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.record({
        accessToken: fc.string({ minLength: 20 }),
        refreshToken: fc.string({ minLength: 20 }),
      }),
      async (tokens) => {
        // Create session with Google auth
        const session = await createGoogleSession(tokens);
        
        // Property: Tokens should not be in session object
        const sessionJson = JSON.stringify(session);
        expect(sessionJson).not.toContain(tokens.accessToken);
        expect(sessionJson).not.toContain(tokens.refreshToken);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Tests

**End-to-End OAuth Flow:**
- Test complete flow from button click to authenticated session
- Test account linking for existing users
- Test repeat sign-ins don't create duplicates

**Session Management:**
- Test Google sessions persist across page refreshes
- Test logout invalidates Google sessions
- Test protected routes work with Google auth

### Manual Testing Checklist

- [ ] New user can sign up with Google
- [ ] Existing user can sign in with Google (auto-links)
- [ ] User cancels OAuth (redirects to login)
- [ ] Session persists after Google sign-in
- [ ] Logout works for Google-authenticated users
- [ ] Protected routes accessible with Google auth

## Security Considerations

### Built-in NextAuth Security

NextAuth provides the following security features automatically:

1. **CSRF Protection:** State parameter in OAuth flow
2. **Redirect URI Validation:** Only whitelisted URIs accepted
3. **Token Storage:** Encrypted in database, never exposed to client
4. **Session Security:** HTTP-only cookies, Secure flag, SameSite=Lax
5. **Account Linking:** Case-insensitive email matching

### Additional Security Measures

1. **Email Verification:**
   - Google accounts are pre-verified
   - Set `emailVerified` timestamp in signIn callback
   - Trust Google's verification process

2. **Input Validation:**
   - Validate all Google profile data before storage
   - Sanitize name and email fields
   - Reject invalid or malicious data

3. **Environment Variables:**
   - Store credentials in environment variables
   - Never commit credentials to version control
   - Use different credentials for dev/prod

4. **Token Management:**
   - Tokens stored in Account table (encrypted by Prisma)
   - Tokens never sent to client-side JavaScript
   - Tokens automatically refreshed by NextAuth

## Performance Considerations

### OAuth Flow Performance

- Google OAuth typically takes 2-4 seconds (acceptable)
- Redirect to Google is immediate (no server processing)
- Callback processing is fast (single database query)

### Database Performance

- Email lookup uses existing index on User.email
- Account lookup uses composite index on (provider, providerAccountId)
- No additional indexes needed

### Client-Side Performance

- GoogleSignInButton is a lightweight client component
- No additional JavaScript bundles required
- Google icon SVG is small (<2KB)

### Caching

- No caching needed for Phase 4
- NextAuth handles session caching automatically
- Profile pictures hosted by Google CDN (fast)

## Deployment Considerations

### Environment Setup

**Development:**
- Google OAuth configured for `http://localhost:3000`
- Redirect URI: `http://localhost:3000/api/auth/callback/google`
- Test credentials in `.env`

**Production:**
- Google OAuth configured for production domain
- Redirect URI: `https://your-domain.com/api/auth/callback/google`
- Production credentials in Vercel environment variables

### Configuration Checklist

- [ ] Google Cloud Project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Authorized origins added (dev + prod)
- [ ] Redirect URIs added (dev + prod)
- [ ] Environment variables set
- [ ] OAuth flow tested in both environments

### Rollback Plan

If Google OAuth causes issues:

1. Comment out GoogleSignInButton in login page
2. Keep GoogleProvider in NextAuth config (don't break existing users)
3. Deploy immediately

This allows existing Google users to continue logging in while hiding the button from new users.

## Future Enhancements (Phase 5/6)

The following features are intentionally deferred to keep Phase 4 lean:

1. **Account Management UI:**
   - View connected accounts
   - Unlink Google account
   - Require password before unlinking

2. **Email Notifications:**
   - Notify when Google account is linked
   - Notify when Google account is unlinked

3. **Custom Error Pages:**
   - User-friendly error messages
   - Retry buttons
   - Support links

4. **Advanced Security:**
   - Audit logs for account linking
   - Multi-device logout
   - Suspicious activity detection

5. **Profile Picture Sync:**
   - Store Google profile picture in User table
   - Update on each sign-in
   - Fallback to default avatar

6. **Analytics:**
   - Track Google sign-in adoption rate
   - Monitor OAuth error rates
   - Measure registration conversion

## References

- [NextAuth.js Google Provider Documentation](https://next-auth.js.org/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Account Linking](https://next-auth.js.org/configuration/callbacks#sign-in-callback)
- [fast-check Documentation](https://fast-check.dev/)
