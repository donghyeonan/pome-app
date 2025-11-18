'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

/**
 * Props for the RegisterForm component
 */
interface RegisterFormProps {
  /** Optional callback to execute after successful registration */
  onSuccess?: () => void;
}

/**
 * Registration Form Component
 *
 * A complete registration form with email/password inputs, password confirmation,
 * password visibility toggle, password requirements display, and auto-login.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <RegisterForm />
 *
 * // With success callback
 * <RegisterForm
 *   onSuccess={() => console.log('Registration successful')}
 * />
 * ```
 *
 * Features:
 * - Name (optional), email, and password inputs with validation
 * - Password confirmation field with match validation
 * - Password visibility toggle for both password fields
 * - Real-time password requirements display
 * - Auto-login after successful registration
 * - Loading state during registration
 * - Error message display
 * - Disabled state during submission
 * - Accessible form labels and ARIA attributes
 *
 * Password Requirements:
 * - Minimum 8 characters
 * - At least 1 letter
 * - At least 1 number
 * - Passwords must match
 *
 * @param {RegisterFormProps} props - Component props
 * @returns {JSX.Element} The registration form component
 */
export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const t = useTranslations('auth');
  const tValidation = useTranslations('validation');
  const { login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
  const canSubmit = isPasswordValid && passwordChecks.passwordsMatch && email.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email) {
      setError(tValidation('required'));
      return;
    }

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
      // Call registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      // Auto-login after successful registration
      try {
        const loginResponse = await login({ email, password });

        if (loginResponse.success) {
          // Call success callback
          if (onSuccess) {
            onSuccess();
          } else {
            // Default: redirect to homepage
            router.push('/');
          }
        } else {
          // Registration succeeded but auto-login failed
          // Redirect to login page
          router.push('/login?registered=true');
        }
      } catch (loginError) {
        // Auto-login failed, redirect to login page
        router.push('/login?registered=true');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Input (Optional) */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          {t('name')} <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="name"
          type="text"
          placeholder={t('name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          autoComplete="name"
        />
      </div>

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

      {/* Password Input */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          {t('password')}
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('password')}
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
            {t('register')}
          </>
        ) : (
          t('register')
        )}
      </Button>
    </form>
  );
}
