'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './use-auth';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';

/**
 * Hook for protecting routes that require authentication
 * Redirects to login page if user is not authenticated
 * Stores intended destination for post-login redirect
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
 * Get the redirect path after login
 * Returns the stored path or default to home
 */
export function getRedirectAfterLogin(): string {
  if (typeof window === 'undefined') {
    return ROUTES.HOME;
  }

  const redirectPath = sessionStorage.getItem(STORAGE_KEYS.REDIRECT_AFTER_LOGIN);
  
  // Clear the stored path
  if (redirectPath) {
    sessionStorage.removeItem(STORAGE_KEYS.REDIRECT_AFTER_LOGIN);
  }

  return redirectPath || ROUTES.HOME;
}
