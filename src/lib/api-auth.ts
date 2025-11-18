// src/lib/api-auth.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/**
 * Require authentication for API routes
 *
 * Returns the authenticated user's session or an error response if not authenticated.
 *
 * @returns Promise<{ session, userId } | NextResponse>
 * @example
 * ```ts
 * const auth = await requireAuthAPI();
 * if (auth instanceof NextResponse) return auth; // Unauthorized
 *
 * const { session, userId } = auth;
 * // Use userId for database queries
 * ```
 */
export async function requireAuthAPI() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  return {
    session,
    userId: session.user.id,
  };
}
