import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

// Protected routes (without locale prefix)
const protectedRoutes = [
  '/saved',
  '/profile',
  '/clinics',
  '/treatments',
  '/search',
];

// Public routes that should always be accessible
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
];

// Check if the pathname matches a protected route
function isProtectedRoute(pathname: string): boolean {
  // Remove locale prefix if present (including 'en')
  const pathWithoutLocale = pathname.replace(/^\/(en|ko|zh|ja)/, '') || '/';

  return protectedRoutes.some((route) =>
    pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );
}

// Check if the pathname matches a public route
function isPublicRoute(pathname: string): boolean {
  // Remove locale prefix if present (including 'en')
  const pathWithoutLocale = pathname.replace(/^\/(en|ko|zh|ja)/, '') || '/';

  return publicRoutes.some((route) =>
    pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );
}

// Combine NextAuth with next-intl middleware
export default withAuth(
  function middleware(req: NextRequest) {
    // Run the intl middleware for all requests
    return intlMiddleware(req);
  },
  {
    callbacks: {
      // Only require authentication for protected routes
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;

        // Allow public routes without authentication
        if (isPublicRoute(pathname)) {
          return true;
        }

        // Require authentication for protected routes
        if (isProtectedRoute(pathname)) {
          return !!token;
        }

        // Allow all other routes (API routes with /api prefix handled separately)
        return true;
      },
    },
    pages: {
      signIn: '/en/login', // Use locale-prefixed path
    },
  }
);

export const config = {
  // Match all page routes, exclude API routes, Next.js internals, and static files
  // API routes handle their own authentication via requireAuthAPI()
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|pome-logo.svg|.*\\..*|_vercel).*)',
  ],
};
