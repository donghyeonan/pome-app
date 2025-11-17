'use client';

import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/auth-context';

/**
 * Authentication Hook
 * 
 * Provides access to the authentication context, including user state,
 * login/logout functions, and loading state.
 * 
 * @hook
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout, isLoading } = useAuth();
 * 
 *   if (isLoading) {
 *     return <LoadingSpinner />;
 *   }
 * 
 *   if (!isAuthenticated) {
 *     return <LoginPrompt />;
 *   }
 * 
 *   return <div>Welcome, {user?.name}!</div>;
 * }
 * ```
 * 
 * Available Properties:
 * - `user` - Current user object or null
 * - `isAuthenticated` - Boolean indicating if user is logged in
 * - `login` - Function to authenticate user
 * - `logout` - Function to end user session
 * - `isLoading` - Boolean indicating if auth state is being determined
 * 
 * @throws {Error} If used outside of AuthProvider
 * @returns {AuthContextType} Authentication context value
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
