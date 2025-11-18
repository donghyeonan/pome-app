'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Props for the ForgotPasswordForm component
 */
interface ForgotPasswordFormProps {
  /** Optional callback to execute after successful submission */
  onSuccess?: () => void;
}

/**
 * Forgot Password Form Component
 *
 * A form for requesting a password reset email. Shows a success message
 * after submission without revealing whether the email exists (security).
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <ForgotPasswordForm />
 *
 * // With success callback
 * <ForgotPasswordForm
 *   onSuccess={() => console.log('Email sent')}
 * />
 * ```
 *
 * Features:
 * - Email input with validation
 * - Success message after submission (always shown for security)
 * - Error handling for network/validation issues
 * - Loading state during submission
 * - Disabled state during submission
 * - Accessible form labels and ARIA attributes
 *
 * Security:
 * - Always shows success message to prevent email enumeration
 * - Rate limited on the backend (10 requests per 10 minutes)
 *
 * Translation Keys Used:
 * - `auth.email` - Email field label and placeholder
 * - `auth.sendResetLink` - Submit button text
 * - `auth.resetLinkSent` - Success message
 * - `auth.checkEmailInstructions` - Instructions after submission
 * - `validation.required` - Required field validation message
 *
 * @param {ForgotPasswordFormProps} props - Component props
 * @returns {JSX.Element} The forgot password form component
 */
export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const t = useTranslations('auth');
  const tValidation = useTranslations('validation');

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email) {
      setError(tValidation('required'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limiting or validation errors
        setError(data.error || 'An error occurred. Please try again.');
        setIsLoading(false);
        return;
      }

      // Show success message (always shown, even if email doesn't exist)
      setIsSuccess(true);
      setIsLoading(false);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Show success state
  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">{t('resetLinkSent')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('checkEmailInstructions')}
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            If you don't see the email, please check your spam folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t('email')}
        </label>
        <Input
          id="email"
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          autoComplete="email"
          required
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-2xl">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading} size="lg">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('sendResetLink')}
          </>
        ) : (
          t('sendResetLink')
        )}
      </Button>
    </form>
  );
}
