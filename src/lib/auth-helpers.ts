// src/lib/auth-helpers.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import type { Session } from 'next-auth';

export async function requireAuth() {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return session.user;
}

export async function getOptionalAuth() {
  const session = (await getServerSession(authOptions)) as Session | null;
  return session?.user || null;
}
