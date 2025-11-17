import { User } from '@/types';
import { mockUsers, defaultMockUser } from '@/data/users';
import { STORAGE_KEYS } from './constants';

/**
 * Mock authentication functions for Phase 1
 * These will be replaced with real authentication in Phase 3
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Mock login function
 * Accepts any email from mockUsers with password "password123"
 */
export async function mockLogin(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { email, password } = credentials;

  // Find user by email
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    return {
      success: false,
      error: 'Invalid email or password',
    };
  }

  // Mock password validation (accept "password123" for all users)
  if (password !== 'password123') {
    return {
      success: false,
      error: 'Invalid email or password',
    };
  }

  // Store user in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  }

  return {
    success: true,
    user,
  };
}

/**
 * Mock logout function
 */
export function mockLogout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }
}

/**
 * Get current authenticated user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!userJson) {
      return null;
    }

    const user = JSON.parse(userJson);
    // Convert createdAt string back to Date
    if (user.createdAt) {
      user.createdAt = new Date(user.createdAt);
    }
    return user;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/**
 * Mock user registration (for future implementation)
 */
export async function mockRegister(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check if email already exists
  const existingUser = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return {
      success: false,
      error: 'Email already registered',
    };
  }

  // Create new user (in Phase 1, this won't persist)
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    name,
    languagePreference: 'en',
    createdAt: new Date(),
  };

  // Store user in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));
  }

  return {
    success: true,
    user: newUser,
  };
}

/**
 * Update user profile
 */
export function updateUserProfile(updates: Partial<User>): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }

  const updatedUser = {
    ...currentUser,
    ...updates,
    id: currentUser.id, // Prevent ID from being changed
    email: currentUser.email, // Prevent email from being changed
    createdAt: currentUser.createdAt, // Prevent createdAt from being changed
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));
  }

  return updatedUser;
}

/**
 * Get mock credentials for testing
 */
export function getMockCredentials() {
  return {
    email: defaultMockUser.email,
    password: 'password123',
  };
}
