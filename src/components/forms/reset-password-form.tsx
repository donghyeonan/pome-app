'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Props for the ResetPasswordForm component
 */
interface ResetPasswordFormProps {
  /** Password reset token from URL */
  token: string;
  /** Optional callback to execute after successful password reset */
  onSuccess?: () => void;
}

/**
 * Reset Password Form Component
 *
 * A form for resetting a user's password using a token from an email link.
 * Includes password requirements display and confirmation.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <ResetPasswordForm token="abc123..." />
 *
 * // With success callback
 * <ResetPasswordForm
 *   token="abc123..."
 *   onSuccess={() => router.push('/login')}
 * />
 * ```
 *
 * Features:
 * - New password and confirm password inputs
 * - Password visibility toggles for both fields
 * - Real-time password requirements display
 * - Password match validation
 * - Token validation error handling
 * - Loading state during submission
 * - Success redirect to login page
 * - Accessible form labels and ARIA attributes
 *
 * Password Requirements:
 * - Minimum 8 characters
 * - At least 1 letter
 * - At least 1 number
 * - Passwords must match
 *
 * Translation Keys Used:
 * - `auth.newPassword` - New password field label
 * - `auth.confirmPassword` - Confirm password field label
 * - `auth.passwordRequirements` - Password requirements header
 * - `auth.resetPassword` - Submit button text
 * - `validation.required` - Required field validation message
 *
 * @param {ResetPasswordFormProps} props - Component props
 * @returns {JSX.Element} The reset password form component
 */
export function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const t = useTranslations('auth');
  const tValidation = useTranslations('validation');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password validation checks
  const passwordChecks = {
    minLength: password.length >= 8,
    hasLetter: /[A-Za-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    passwordsMatch: password === confirmPassword && confirmPassword.length > 0,
  };

  const isPasswordValid = passwordChecks.minLength && passwordChecks.hasLetter && passwordChecks.hasNumber;
  const canSubmit = isPasswordValid && passwordChecks.passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password) {
      setError(tValidation('required'));
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Password reset failed');
        setIsLoading(false);
        return;
      }

      // Success - redirect to login page
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/login?reset=success');
      }
    } catch (err) {
      setError('Password reset failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* New Password Input */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          {t('newPassword')}
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('newPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          {t('confirmPassword')}
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('confirmPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Password Requirements */}
      {password.length > 0 && (
        <div className="space-y-2 text-sm">
          <p className="font-medium">{t('passwordRequirements')}:</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              {passwordChecks.minLength ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={passwordChecks.minLength ? 'text-green-600' : 'text-muted-foreground'}>
                At least 8 characters
              </span>
            </li>
            <li className="flex items-center gap-2">
              {passwordChecks.hasLetter ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={passwordChecks.hasLetter ? 'text-green-600' : 'text-muted-foreground'}>
                At least 1 letter
              </span>
            </li>
            <li className="flex items-center gap-2">
              {passwordChecks.hasNumber ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={passwordChecks.hasNumber ? 'text-green-600' : 'text-muted-foreground'}>
                At least 1 number
              </span>
            </li>
            {confirmPassword.length > 0 && (
              <li className="flex items-center gap-2">
                {passwordChecks.passwordsMatch ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={passwordChecks.passwordsMatch ? 'text-green-600' : 'text-muted-foreground'}>
                  Passwords match
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-2xl">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !canSubmit}
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('resetPassword')}
          </>
        ) : (
          t('resetPassword')
        )}
      </Button>
    </form>
  );
}
