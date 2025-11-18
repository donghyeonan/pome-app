// src/lib/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function getOptionalAuth() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

// For API routes
export async function requireAuthAPI(req: NextRequest) {
  const user = await requireAuth();
  return user;
}
