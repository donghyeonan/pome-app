// src/types/next-auth.d.ts
// Extended NextAuth types

import type { AuthOptions as OriginalAuthOptions } from 'next-auth/core/types';

declare module "next-auth" {
  // Re-export AuthOptions for consumers
  export type AuthOptions = OriginalAuthOptions;

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
  }
}
