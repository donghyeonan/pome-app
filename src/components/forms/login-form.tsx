'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';

/**
 * Props for the LoginForm component
 */
interface LoginFormProps {
  /** Optional callback to execute after successful login */
  onSuccess?: () => void;
}

/**
 * Login Form Component
 * 
 * A complete login form with email/password inputs, password visibility toggle,
 * remember me checkbox, and error handling.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <LoginForm />
 * 
 * // With success callback
 * <LoginForm 
 *   onSuccess={() => router.push('/dashboard')}
 * />
 * ```
 * 
 * Features:
 * - Email and password inputs with validation
 * - Password visibility toggle (Eye/EyeOff icons)
 * - Remember me checkbox with localStorage persistence
 * - Loading state during authentication
 * - Error message display
 * - Disabled state during submission
 * - Accessible form labels and ARIA attributes
 * 
 * Translation Keys Used:
 * - `auth.email` - Email field label and placeholder
 * - `auth.password` - Password field label and placeholder
 * - `auth.rememberMe` - Remember me checkbox label
 * - `auth.login` - Login button text
 * - `auth.invalidCredentials` - Error message for failed login
 * - `validation.required` - Required field validation message
 * 
 * @param {LoginFormProps} props - Component props
 * @returns {JSX.Element} The login form component
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
  const t = useTranslations('auth');
  const tValidation = useTranslations('validation');
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email) {
      setError(tValidation('required'));
      return;
    }

    if (!password) {
      setError(tValidation('required'));
      return;
    }

    try {
      const response = await login({ email, password });

      if (response.success) {
        // Store remember me preference if needed
        if (rememberMe && typeof window !== 'undefined') {
          localStorage.setItem('rememberMe', 'true');
        }

        // Call success callback
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.error || t('invalidCredentials'));
      }
    } catch (err) {
      setError(t('invalidCredentials'));
    }
  };

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
            autoComplete="current-password"
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

      {/* Remember Me Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked: boolean) => setRememberMe(checked)}
          disabled={isLoading}
        />
        <label
          htmlFor="remember"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {t('rememberMe')}
        </label>
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
            {t('login')}
          </>
        ) : (
          t('login')
        )}
      </Button>
    </form>
  );
}
