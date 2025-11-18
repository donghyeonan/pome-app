'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

interface SessionProviderProps {
  children: React.ReactNode;
}

/**
 * Session Provider Wrapper
 *
 * Client-side wrapper for NextAuth's SessionProvider.
 * Required because the root layout is a Server Component.
 *
 * This component provides session state to all client components
 * via the useSession hook.
 *
 * @component
 */
export function SessionProvider({ children }: SessionProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
