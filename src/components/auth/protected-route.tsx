'use client';

import { useProtectedRoute } from '@/hooks/use-protected-route';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component wrapper for protected routes
 * Shows fallback (or nothing) while checking authentication
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children, fallback = null }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useProtectedRoute();

  // Show fallback while loading
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Show nothing if not authenticated (redirect is happening)
  if (!isAuthenticated) {
    return null;
  }

  // Show protected content
  return <>{children}</>;
}
