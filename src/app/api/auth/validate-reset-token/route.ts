// src/app/api/auth/validate-reset-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const validateTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token: rawToken } = validateTokenSchema.parse(body);

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
        { error: "invalid", message: "Invalid or expired password reset token" },
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
        { error: "expired", message: "Password reset token has expired" },
        { status: 400 }
      );
    }

    // Token is valid
    return NextResponse.json(
      { valid: true, message: "Token is valid" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "validation", message: "Invalid request" },
        { status: 400 }
      );
    }

    console.error("Validate reset token error:", error);
    return NextResponse.json(
      { error: "server", message: "An error occurred while validating the token" },
      { status: 500 }
    );
  }
}
