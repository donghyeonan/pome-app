// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/lib/email";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting (10 requests per 10 minutes per IP)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitKey = `forgot-password:${ip}`;
    const isAllowed = await checkRateLimit(
      rateLimitKey,
      RATE_LIMITS.FORGOT_PASSWORD.requests,
      RATE_LIMITS.FORGOT_PASSWORD.window
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many password reset attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Look up user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // SECURITY: Always return success to prevent email enumeration
    // Don't reveal whether the email exists or not
    if (!user) {
      return NextResponse.json(
        { message: "If that email address is registered, you will receive a password reset link." },
        { status: 200 }
      );
    }

    // Delete any existing unexpired tokens for this email (security best practice)
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
        expires: {
          gt: new Date(),
        },
      },
    });

    // Generate secure random token (32 bytes = 64 hex characters)
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Hash token with SHA-256 before storage (prevents token theft from DB)
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Store hashed token with 1-hour expiration
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires: expiresAt,
      },
    });

    // Send email with raw token (NOT the hashed version)
    try {
      await sendPasswordResetEmail(email, rawToken);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Continue and return success even if email fails (better UX)
      // In production, you might want to log this to a monitoring service
    }

    // Always return success (prevent enumeration)
    return NextResponse.json(
      { message: "If that email address is registered, you will receive a password reset link." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email address", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
