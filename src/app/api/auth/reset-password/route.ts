// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword, passwordSchema } from "@/lib/password";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token: rawToken, password } = resetPasswordSchema.parse(body);

    // Hash the received token for comparison (same method as storage)
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Find the token in the database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token: hashedToken,
      },
    });

    // Validate token exists
    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired password reset token" },
        { status: 400 }
      );
    }

    // Check token expiration
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: {
          token: hashedToken,
        },
      });

      return NextResponse.json(
        { error: "Password reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Get the user email from the token
    const email = verificationToken.identifier;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Clean up token for non-existent user
      await prisma.verificationToken.delete({
        where: {
          token: hashedToken,
        },
      });

      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Hash new password with bcrypt
    const newPasswordHash = await hashPassword(password);

    // Update user password and invalidate all sessions in a transaction
    await prisma.$transaction([
      // Update password and set passwordChangedAt timestamp
      prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newPasswordHash,
          passwordChangedAt: new Date(), // Track when password was changed
        },
      }),
      // Invalidate all user sessions (force re-login)
      prisma.session.deleteMany({
        where: {
          userId: user.id,
        },
      }),
      // Delete the used token (one-time use)
      prisma.verificationToken.delete({
        where: {
          token: hashedToken,
        },
      }),
    ]);

    // Return success (no auto-login for security)
    return NextResponse.json(
      { message: "Password reset successful. Please log in with your new password." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
