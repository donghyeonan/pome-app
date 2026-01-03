/**
 * User Query Functions
 *
 * Reusable database query functions for users.
 * Used by API routes and auth system.
 */

import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export type SafeUser = Omit<User, 'passwordHash'>;

// ─────────────────────────────────────────────────────────────
// Query Functions
// ─────────────────────────────────────────────────────────────

/**
 * Get user by ID (without password)
 */
export async function getUserById(id: string): Promise<SafeUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

/**
 * Get user by email (without password)
 */
export async function getUserByEmail(email: string): Promise<SafeUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

/**
 * Get user by email with password (for auth only)
 * DO NOT expose password hash outside auth flow
 */
export async function getUserByEmailWithPassword(
  email: string
): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

/**
 * Check if email exists
 */
export async function emailExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });
  return user !== null;
}

/**
 * Get user's saved items
 */
export async function getUserSavedItems(userId: string) {
  return prisma.savedItem.findMany({
    where: { userId },
    orderBy: { savedAt: 'desc' },
  });
}

/**
 * Get user count
 */
export async function getUserCount(): Promise<number> {
  return prisma.user.count();
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    language?: string;
    gender?: string;
    ageRange?: string;
    skinType?: string;
    treatmentGoals?: string[];
  }
): Promise<SafeUser> {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
