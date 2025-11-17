'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './use-auth';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';

/**
 * Protected Route Hook
 * 
 * Enforces authentication requirements for protected routes. Automatically
 * redirects unauthenticated users to the login page and stores the intended
 * destination for post-login redirect.
 * 
 * @hook
 * @example
 * ```tsx
 * function ProtectedPage() {
 *   const { isAuthenticated, isLoading } = useProtectedRoute();
 * 
 *   if (isLoading) {
 *     return <LoadingSpinner />;
 *   }
 * 
 *   if (!isAuthenticated) {
 *     return null; // Redirect is happening
 *   }
 * 
 *   return <ProtectedContent />;
 * }
 * ```
 * 
 * Features:
 * - Automatic redirect to login page for unauthenticated users
 * - Stores current pathname in sessionStorage for post-login redirect
 * - Returns loading state to show appropriate UI
 * - Returns authentication state for conditional rendering
 * 
 * Available Properties:
 * - `isAuthenticated` - Boolean indicating if user is logged in
 * - `isLoading` - Boolean indicating if auth state is being determined
 * 
 * @returns {Object} Authentication state
 */
export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the intended destination
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEYS.REDIRECT_AFTER_LOGIN, pathname);
      }

      // Redirect to login
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  return { isAuthenticated, isLoading };
}

/**
 * Get Redirect After Login
 * 
 * Retrieves the stored redirect path from sessionStorage and clears it.
 * Used after successful login to navigate the user to their intended destination.
 * 
 * @function
 * @example
 * ```tsx
 * async function handleLogin(credentials) {
 *   await login(credentials);
 *   const redirectPath = getRedirectAfterLogin();
 *   router.push(redirectPath);
 * }
 * ```
 * 
 * @returns {string} The stored redirect path or home route as fallback
 */
export function getRedirectAfterLogin(): string {
  if (typeof window === 'undefined') {
    return ROUTES.HOME;
  }

  const redirectPath = sessionStorage.getItem(
    STORAGE_KEYS.REDIRECT_AFTER_LOGIN
  );

  // Clear the stored path
  if (redirectPath) {
    sessionStorage.removeItem(STORAGE_KEYS.REDIRECT_AFTER_LOGIN);
  }

  return redirectPath || ROUTES.HOME;
}
