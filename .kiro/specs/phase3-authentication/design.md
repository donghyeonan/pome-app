# Phase 3: Authentication - Design Document

## Introduction

This document outlines the technical design for implementing real user authentication in the Pome application using NextAuth.js, replacing the existing mock authentication system. The design prioritizes security, user experience, and maintainability while providing a foundation for future authentication enhancements.

## Glossary

- **NextAuth.js**: Authentication library for Next.js providing session management and OAuth support
- **JWT Strategy**: Token-based authentication where user data is encoded in the token itself
- **Prisma Adapter**: NextAuth adapter that stores session data in the database via Prisma
- **Credentials Provider**: Authentication method using email/password credentials
- **bcrypt**: Industry-standard password hashing algorithm with built-in salting
- **Resend**: Modern email API service with React Email template support
- **Middleware**: Next.js edge function that runs before request completion

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Login Form   │  │Register Form │  │ Reset Form   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js App Router                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Middleware Layer                       │  │
│  │  - Route Protection                                       │  │
│  │  - Session Validation                                     │  │
│  │  - Redirect Logic                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  NextAuth.js Core                         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │ Credentials│  │   JWT      │  │  Session   │         │  │
│  │  │  Provider  │  │  Strategy  │  │  Manager   │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Routes                             │  │
│  │  /api/auth/[...nextauth]  - NextAuth handlers            │  │
│  │  /api/auth/register       - User registration            │  │
│  │  /api/auth/forgot-password - Password reset request      │  │
│  │  /api/auth/reset-password  - Password reset completion   │  │
│  │  /api/saved/*             - Protected endpoints          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Prisma     │  │   bcrypt     │  │   Resend     │          │
│  │   Client     │  │   Hashing    │  │   Email      │          │
│  └──────┬───────┘  └──────────────┘  └──────────────┘          │
└─────────┼──────────────────────────────────────────────────────┘
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Neon PostgreSQL Database                        │
│  - User (with passwordHash)                                      │
│  - Account (OAuth, future)                                       │
│  - Session (NextAuth sessions)                                   │
│  - VerificationToken (password reset)                            │
│  - SavedItem (user-specific data)                                │
└─────────────────────────────────────────────────────────────────┘
```

### Authentication Flow Diagrams

#### Registration Flow
```
User → Register Form → Validation → API /api/auth/register
                                           │
                                           ├─ Check email uniqueness
                                           ├─ Hash password (bcrypt)
                                           ├─ Create user in DB
                                           ├─ Auto-login via NextAuth
                                           └─ Redirect to dashboard
```

#### Login Flow
```
User → Login Form → NextAuth signIn() → Credentials Provider
                                              │
                                              ├─ Find user by email
                                              ├─ Verify password hash
                                              ├─ Create JWT session
                                              ├─ Set HTTP-only cookie
                                              └─ Redirect to intended page
```

#### Password Reset Flow
```
User → Forgot Password → API /api/auth/forgot-password
                              │
                              ├─ Rate limit check (10/10min)
                              ├─ Validate email
                              ├─ Generate raw token (32 bytes)
                              ├─ Hash token (SHA-256)
                              ├─ Store hash in DB (1hr expiry)
                              └─ Send email with raw token via Resend
                                    │
User ← Email with reset link ←─────┘
                                    │
User → Click link → Reset Password Page → API /api/auth/reset-password
                                                │
                                                ├─ Hash received token
                                                ├─ Validate hashed token
                                                ├─ Check expiration
                                                ├─ Hash new password
                                                ├─ Update user password
                                                ├─ Invalidate all sessions
                                                ├─ Delete used token
                                                └─ Redirect to login (no auto-login)
```

## Components and Interfaces

### Database Schema Updates

```prisma
// Updated User model
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String    // bcrypt hashed password
  name          String?
  emailVerified DateTime? // For future email verification
  language      String    @default("en")
  gender        String?
  ageRange      String?
  skinType      String?
  treatmentGoals Json?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  savedItems    SavedItem[]
  
  @@index([email])
}

// NextAuth Account model (for future OAuth)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
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

// NextAuth Session model
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([sessionToken])
  @@index([userId])
}

// VerificationToken for password resets
model VerificationToken {
  identifier String   // email address
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
  @@index([token])
}
```

### NextAuth Configuration

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  session: {
    strategy: "database", // Use database sessions for revocability
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    // With database sessions, user data comes from DB, not JWT
    async session({ session, user }) {
      if (user && session.user) {
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.name = user.name;
      }
      return session;
    }
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### Password Utilities

```typescript
// src/lib/password.ts
import bcrypt from "bcryptjs";
import { z } from "zod";

const SALT_ROUNDS = 10;

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const result = passwordSchema.safeParse(password);
  return {
    valid: result.success,
    errors: result.success ? [] : result.error.errors.map(e => e.message),
  };
}
```

### API Route Implementations

#### Registration Endpoint

```typescript
// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, passwordSchema } from "@/lib/password";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  name: z.string().min(1).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting (5 registrations per 10 minutes per IP)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitKey = `register:${ip}`;
    const isAllowed = await checkRateLimit(
      rateLimitKey,
      RATE_LIMITS.REGISTER.requests,
      RATE_LIMITS.REGISTER.window
    );
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password, name } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        emailVerified: null, // No email verification in Phase 3
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(
      { user, message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
```

#### Password Reset Request

```typescript
// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Simple rate limiting (10 requests per 10 minutes per IP)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitKey = `forgot-password:${ip}`;
    const isAllowed = await checkRateLimit(rateLimitKey, 10, 600); // 10 requests, 600 seconds
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Find user (but don't reveal if they exist)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Delete any existing unexpired tokens for this email (security)
      await prisma.verificationToken.deleteMany({
        where: {
          identifier: email,
          expires: { gt: new Date() }, // Only delete non-expired
        },
      });

      // Generate reset token (raw)
      const rawToken = randomBytes(32).toString("hex");
      
      // Hash token for storage (security best practice)
      const hashedToken = createHash("sha256").update(rawToken).digest("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store hashed token
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: hashedToken, // Store hashed version
          expires,
        },
      });

      // Send email with raw token
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${rawToken}`;
      await sendPasswordResetEmail(email, resetUrl, user.name || "User");
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: "If that email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Request failed" },
      { status: 500 }
    );
  }
}
```

#### Password Reset Completion

```typescript
// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword, passwordSchema } from "@/lib/password";

const resetPasswordSchema = z.object({
  token: z.string(),
  password: passwordSchema,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = resetPasswordSchema.parse(body);

    // Hash the raw token to compare with stored hash
    const hashedToken = createHash("sha256").update(token).digest("hex");

    // Find and validate hashed token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token: hashedToken },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    if (verificationToken.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { token: hashedToken },
      });
      return NextResponse.json(
        { error: "Reset link has expired" },
        { status: 400 }
      );
    }

    // Update password
    const passwordHash = await hashPassword(password);
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { passwordHash },
    });

    // Invalidate all existing sessions for this user (security)
    await prisma.session.deleteMany({
      where: {
        user: { email: verificationToken.identifier }
      }
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: { token: hashedToken },
    });

    return NextResponse.json({
      message: "Password reset successful. Please log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Password reset failed" },
      { status: 500 }
    );
  }
}
```

### Rate Limiting Utility

```typescript
// src/lib/rate-limit.ts
// ⚠️ WARNING: In-memory rate limiting is per-instance only!
// In multi-instance deployments (Vercel auto-scaling), each instance has its own Map.
// Users could bypass rate limits by hitting different instances.
// This is acceptable for Phase 3 MVP with single-region, low-traffic deployment.
// For production with auto-scaling, upgrade to Vercel KV or Upstash Redis in Phase 5.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  entry.count++;
  return true;
}

// Rate limit configurations
export const RATE_LIMITS = {
  REGISTER: { requests: 5, window: 600 }, // 5 per 10 min
  FORGOT_PASSWORD: { requests: 10, window: 600 }, // 10 per 10 min
  LOGIN: { requests: 10, window: 300 }, // 10 per 5 min (handled by NextAuth)
};
```

### Email Service

```typescript
// src/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  userName: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Pome <noreply@pome.com>",
      to,
      subject: "Reset your Pome password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                We received a request to reset your password for your Pome account. 
                Click the button below to create a new password:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 14px 30px; 
                          text-decoration: none; 
                          border-radius: 6px; 
                          font-weight: 600;
                          display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                This link will expire in 1 hour for security reasons.
              </p>
              <p style="font-size: 14px; color: #666;">
                If you didn't request a password reset, you can safely ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #999; text-align: center;">
                © ${new Date().getFullYear()} Pome. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    // Don't throw - we don't want to reveal email sending failures to users
  }
}
```

### Middleware for Route Protection

```typescript
// middleware.ts
// ⚠️ IMPORTANT: This app uses next-intl for i18n, so we must combine middlewares
import createIntlMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

// Create the i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'ko', 'zh', 'ja'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

// Combine NextAuth with i18n middleware
export default withAuth(
  function middleware(req: NextRequest) {
    // First apply i18n middleware
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Require valid session
    },
    pages: {
      signIn: '/login', // Redirect to login if unauthorized
    },
  }
);

export const config = {
  matcher: [
    // Apply to all routes with locale prefix
    '/(en|ko|zh|ja)/:path*',
    
    // Protected page routes (with locale)
    '/:locale/clinics/:path*',
    '/:locale/treatments',
    '/:locale/search/:path*',
    '/:locale/saved/:path*',
    '/:locale/profile/:path*',
    
    // Protected API routes
    '/api/saved/:path*',
  ],
};
```

### Auth Helper Utilities

```typescript
// src/lib/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  
  return session.user;
}

export async function getOptionalAuth() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

// For API routes
export async function requireAuthAPI(req: NextRequest) {
  const user = await requireAuth();
  return user;
}
```

### Updated Auth Context

```typescript
// src/contexts/auth-context.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: {
    id: string;
    email: string;
    name?: string | null;
  } | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    router.refresh();
  };

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const register = async (email: string, password: string, name?: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Registration failed");
    }

    // Auto-login after registration
    await login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        loading,
        isAuthenticated: !!session?.user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

## Data Models

### Session Data Structure

```typescript
// Extended NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
  }
}
```

## Error Handling

### Error Response Format

```typescript
// Standardized error responses
interface ApiError {
  error: string;
  details?: any;
}

// Generic auth errors (prevent information disclosure)
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_EXISTS: "Email already registered",
  WEAK_PASSWORD: "Password does not meet requirements",
  EXPIRED_TOKEN: "Reset link has expired",
  INVALID_TOKEN: "Invalid reset link",
  GENERIC: "Something went wrong. Please try again.",
};
```

### Error Logging

```typescript
// Server-side error logging (detailed)
function logAuthError(context: string, error: any, metadata?: any) {
  console.error(`[AUTH ERROR] ${context}:`, {
    error: error.message,
    stack: error.stack,
    metadata,
    timestamp: new Date().toISOString(),
  });
}

// Client-side error handling (generic)
function handleAuthError(error: any): string {
  // Never expose detailed errors to client
  return AUTH_ERRORS.GENERIC;
}
```

## Testing Strategy

### Unit Tests
- Password hashing and verification
- Password validation rules
- Token generation and validation
- Email template rendering

### Integration Tests
- Registration flow (success and failure cases)
- Login flow (valid/invalid credentials)
- Password reset flow (request and completion)
- Session management (creation, validation, expiration)
- Route protection (authenticated and unauthenticated access)

### Security Tests
- SQL injection attempts
- XSS attempts in forms
- CSRF protection validation
- Session hijacking prevention
- Password brute-force protection (rate limiting in Phase 5)

## Design Decisions & Tradeoffs

### 1. Database Sessions vs JWT-Only
**Decision**: Use database sessions instead of JWT-only strategy

**Rationale**:
- Sessions are revocable (critical for password resets and security incidents)
- Better security posture (can invalidate sessions server-side)
- Minimal performance impact with proper indexing
- Easier to implement "logout everywhere" functionality

**Tradeoff**: Slightly more database queries, but worth it for security

### 2. Rate Limiting in Phase 3
**Decision**: Implement simple in-memory rate limiting now

**Rationale**:
- Prevents abuse of registration and password reset endpoints
- Protects Resend email quota
- Simple implementation (no external dependencies)
- Will be upgraded to Redis/Upstash in Phase 5

**Limits**:
- Registration: 5 attempts per 10 minutes per IP
- Forgot password: 10 attempts per 10 minutes per IP
- Login: Handled by NextAuth (10 per 5 min recommended)

**⚠️ Known Limitation**:
- In-memory rate limiting is **per-instance only**
- In multi-instance deployments (Vercel auto-scaling), each instance has its own Map
- Users could bypass limits by hitting different instances
- **Acceptable for Phase 3** with single-region, low-traffic deployment
- **Must upgrade to Vercel KV or Upstash Redis in Phase 5** for production scaling

### 3. Hashed Reset Tokens
**Decision**: Hash password reset tokens before storing in database

**Rationale**:
- Prevents database admins from using tokens
- Protects against database leaks
- Industry best practice (treat tokens like passwords)
- Minimal performance overhead (SHA-256 is fast)

**Implementation**: Store hash(token) in DB, send raw token via email

### 4. No Auto-Login After Password Reset
**Decision**: Redirect to login page after successful password reset

**Rationale**:
- More secure (prevents email-only account takeover)
- Forces user to confirm they remember new password
- Industry standard for sensitive operations
- Better UX: pre-fill email field on login page

**Tradeoff**: One extra step for user, but significantly more secure

### 5. UI State Management
**Decision**: Keep AuthContext simple for Phase 3, plan for enhancement

**Current Approach**:
- AuthContext wraps NextAuth's useSession
- Server session is source of truth
- Client state resets on page refresh (acceptable for Phase 3)

**Future Enhancement (Phase 4)**:
- Add UserContext for client-side state
- Merge server session with client preferences
- Support for role-based UI, banners, experiments
- Persistent UI state across refreshes

## Security Considerations

### Password Security
- bcrypt with 10 salt rounds (industry standard)
- Minimum 8 characters, 1 letter, 1 number
- Maximum 128 characters (password manager support)
- Never log or expose passwords
- Secure password reset flow with time-limited tokens

### Session Security
- Database sessions (revocable, more secure than JWT-only)
- HTTP-only cookies (prevent XSS)
- Secure flag in production (HTTPS only)
- SameSite=Lax (CSRF protection)
- 30-day expiration with 24-hour refresh
- Sessions invalidated on password reset

### API Security
- Input validation with Zod
- Generic error messages (prevent enumeration)
- Rate limiting preparation (Phase 5)
- CORS configuration
- SQL injection prevention via Prisma

### Email Security
- Time-limited reset tokens (1 hour)
- Single-use tokens
- Secure token generation (crypto.randomBytes)
- Tokens hashed before storage (SHA-256)
- No sensitive data in email content
- Generic success messages
- Rate limiting on email endpoints (10 per 10 min)

## Performance Considerations

### Database Optimization
- Indexes on frequently queried fields (email, sessionToken)
- Connection pooling via Prisma
- Efficient query patterns

### Caching Strategy
- JWT tokens reduce database queries
- Session validation cached by NextAuth
- No additional caching needed in Phase 3

### Email Performance
- Async email sending (non-blocking)
- Resend's reliable delivery infrastructure
- Simple HTML templates (fast rendering)

## Migration Strategy

### Phase 1: Setup
1. Install dependencies (next-auth, bcryptjs, resend)
2. Update Prisma schema
3. Run database migrations
4. Configure environment variables

### Phase 2: Core Auth
1. Implement NextAuth configuration
2. Create password utilities
3. Build registration endpoint
4. Update login to use NextAuth

### Phase 3: Password Reset
1. Set up Resend email service
2. Create forgot password endpoint
3. Create reset password endpoint
4. Build email templates

### Phase 4: Route Protection
1. Configure middleware
2. Update API routes with auth checks
3. Update saved items to use real user ID

### Phase 5: UI Updates
1. Update auth context
2. Update login form
3. Create registration form
4. Create password reset forms

### Phase 6: Cleanup
1. Remove mock auth files
2. Remove localStorage auth logic
3. Update all components
4. Test all flows

## Environment Configuration

```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Email Service (Resend)
RESEND_API_KEY="re_..."

# Email From Address
# Development: Use Resend's test domain (no verification needed)
EMAIL_FROM="onboarding@resend.dev"

# Production: Must verify your domain in Resend dashboard first
# EMAIL_FROM="Pome <noreply@yourdomain.com>"

# Database (already configured in Phase 2)
DATABASE_URL="postgresql://..."
```

### Resend Email Configuration

**Development Setup:**
1. Sign up for Resend account (free tier)
2. Get API key from dashboard
3. Use `onboarding@resend.dev` as sender (no verification needed)
4. Set `EMAIL_FROM="onboarding@resend.dev"` in `.env`

**Production Setup:**
1. Verify your domain in Resend dashboard
2. Add DNS records (SPF, DKIM, DMARC)
3. Wait for verification (usually < 24 hours)
4. Update `EMAIL_FROM="Pome <noreply@yourdomain.com>"`

**Testing Email Delivery:**
- Option 1: Use Resend test mode with `onboarding@resend.dev`
- Option 2: Use MailHog/Mailpit for local email capture
- Option 3: Use your personal email for testing
- Verify email formatting, links, and styling work correctly

## Known Limitations & Workarounds

### 1. In-Memory Rate Limiting (Multi-Instance)
**Limitation**: Rate limiting is per-instance in multi-instance deployments
**Impact**: Users could bypass limits by hitting different Vercel instances
**Workaround**: Acceptable for Phase 3 MVP with low traffic
**Fix**: Upgrade to Vercel KV or Upstash Redis in Phase 5

### 2. Email Domain Verification
**Limitation**: Resend requires domain verification for production
**Impact**: Cannot send from custom domain without DNS setup
**Workaround**: Use `onboarding@resend.dev` for development/testing
**Fix**: Complete domain verification before production deployment

### 3. Password Complexity
**Limitation**: No uppercase or special character requirements
**Impact**: Some users may choose weaker passwords
**Rationale**: Follows NIST guidelines (length > complexity)
**Enhancement**: Add optional password strength indicator in Phase 4

### 4. No Email Verification
**Limitation**: Users can register with any email (no verification)
**Impact**: Potential for fake accounts or typos
**Rationale**: Intentional for Phase 3 (instant access)
**Fix**: Add email verification in Phase 4

### 5. Middleware Complexity
**Limitation**: Must combine NextAuth + next-intl middlewares
**Impact**: More complex middleware configuration
**Workaround**: Use `withAuth()` wrapper pattern (documented in design)
**Note**: This is the correct approach for apps with i18n

## Future Enhancements (Phase 4+)

### Phase 4
- Email verification
- User profile management
- Account settings page

### Phase 5
- Rate limiting
- Account deletion
- Advanced security features

### Phase 6
- OAuth providers (Google, Apple, Kakao)
- Two-factor authentication
- Social login integration

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
9. ✅ All existing functionality continues to work
10. ✅ System is ready for Phase 4 enhancements
