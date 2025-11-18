// src/lib/email.ts
import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender address
const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev";

// Application URL for reset links
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

/**
 * Send password reset email with token
 *
 * @param email - User's email address
 * @param token - Raw password reset token (NOT hashed)
 * @throws Error if email sending fails
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  // Construct reset link with token
  const resetLink = `${APP_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset Your Pome Password",
      html: createPasswordResetEmailTemplate(resetLink),
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}

/**
 * Create HTML email template for password reset
 *
 * @param resetLink - The password reset link with token
 * @returns HTML email template
 */
function createPasswordResetEmailTemplate(resetLink: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Pome Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #7c3aed;
      margin-bottom: 10px;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #7c3aed;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      text-align: center;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #6d28d9;
    }
    .security-notice {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .security-notice h3 {
      margin: 0 0 8px 0;
      color: #92400e;
      font-size: 16px;
    }
    .security-notice p {
      margin: 0;
      color: #78350f;
      font-size: 14px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      font-size: 12px;
      color: #737373;
      text-align: center;
    }
    .link {
      color: #7c3aed;
      text-decoration: none;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Pome</div>
      <h1 style="margin: 0; font-size: 24px; color: #171717;">Reset Your Password</h1>
    </div>

    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password for your Pome account. Click the button below to create a new password:</p>

      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>

      <p>Or copy and paste this link into your browser:</p>
      <p><a href="${resetLink}" class="link">${resetLink}</a></p>

      <div class="security-notice">
        <h3>⚠️ Security Notice</h3>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
      </div>

      <p>For security reasons, this password reset link can only be used once.</p>
    </div>

    <div class="footer">
      <p>This email was sent by Pome - Discover Beauty Procedures in Korea</p>
      <p>If you have any questions, please contact our support team.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
