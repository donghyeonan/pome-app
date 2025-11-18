// src/lib/rate-limit.ts
// ⚠️ WARNING: In-memory rate limiting is per-instance only!
// In multi-instance deployments (Vercel auto-scaling), each instance has its own Map.
// Users could bypass rate limits by hitting different instances.
// This is acceptable for Phase 3 MVP with single-region, low-traffic deployment.
// For production with auto-scaling, upgrade to Vercel KV or Upstash Redis in Phase 5.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  entry.count++;
  return true;
}

// Rate limit configurations
export const RATE_LIMITS = {
  REGISTER: { requests: 5, window: 600 }, // 5 per 10 min
  FORGOT_PASSWORD: { requests: 10, window: 600 }, // 10 per 10 min
  LOGIN: { requests: 10, window: 300 }, // 10 per 5 min (handled by NextAuth)
};
