'use client';

import React, { createContext } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { User } from '@/types';

// Types for backward compatibility
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication Provider using NextAuth.js
 *
 * Provides authentication state and functions to the app.
 * Replaces the mock authentication system with real NextAuth integration.
 *
 * Features:
 * - Real database sessions via NextAuth
 * - Session persistence across page refreshes
 * - Automatic session refresh
 * - Multi-tab sync via NextAuth
 * - Login/logout functionality
 *
 * @component
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  // Convert NextAuth session to our User type
  const user: User | null = session?.user
    ? {
        id: (session.user as { id: string }).id,
        email: session.user.email || '',
        name: session.user.name || '',
        // Default values for fields not in NextAuth session
        languagePreference: 'en',
        createdAt: new Date(),
      }
    : null;

  /**
   * Login function using NextAuth credentials provider
   * Maintains backward compatibility with existing code
   */
  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      if (result?.ok) {
        return {
          success: true,
          user: null, // User will be available from session after signIn
        };
      }

      return {
        success: false,
        error: 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An error occurred during login',
      };
    }
  };

  /**
   * Logout function using NextAuth signOut
   * Clears session and redirects to homepage
   */
  const logout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!session,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
