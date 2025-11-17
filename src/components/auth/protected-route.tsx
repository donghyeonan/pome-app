'use client';

import { useProtectedRoute } from '@/hooks/use-protected-route';

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  /** Content to show when user is authenticated */
  children: React.ReactNode;
  /** Optional content to show while checking authentication */
  fallback?: React.ReactNode;
}

/**
 * Protected Route Component
 * 
 * A wrapper component that enforces authentication requirements for protected
 * content. Automatically redirects unauthenticated users to the login page
 * and preserves the intended destination for post-login redirect.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <ProtectedRoute>
 *   <ProtectedPageContent />
 * </ProtectedRoute>
 * 
 * // With loading fallback
 * <ProtectedRoute fallback={<LoadingSpinner />}>
 *   <ProtectedPageContent />
 * </ProtectedRoute>
 * ```
 * 
 * Behavior:
 * - Shows fallback (or nothing) while checking authentication
 * - Redirects to /login if user is not authenticated
 * - Stores current URL for post-login redirect
 * - Shows children only when authenticated
 * 
 * @param {ProtectedRouteProps} props - Component props
 * @returns {JSX.Element | null} Protected content, fallback, or null
 */
export function ProtectedRoute({
  children,
  fallback = null,
}: ProtectedRouteProps) {
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
