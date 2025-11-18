'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { ResetPasswordForm } from '@/components/forms/reset-password-form';
import { Button } from '@/components/ui/button';

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Extract token from query params
    const tokenParam = searchParams.get('token');

    if (!tokenParam) {
      setIsValidating(false);
      return;
    }

    setToken(tokenParam);
    setIsValidating(false);
  }, [searchParams]);

  const handleResetSuccess = () => {
    // Redirect to login page with success message
    router.push('/login?reset=success');
  };

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  // Show error state if token is missing
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Brand */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Pome</h1>
          </div>

          {/* Error Card */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <XCircle className="h-16 w-16 text-destructive" />
              <h2 className="text-2xl font-semibold">Invalid Reset Link</h2>
              <p className="text-muted-foreground">
                This password reset link is invalid or missing. Please request a new password reset link.
              </p>
              <div className="flex flex-col gap-2 w-full pt-4">
                <Link href="/forgot-password" className="w-full">
                  <Button className="w-full" size="lg">
                    Request New Link
                  </Button>
                </Link>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full" size="lg">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show reset password form
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Pome</h1>
          <p className="text-muted-foreground">{t('createNewPassword')}</p>
        </div>

        {/* Reset Password Form Card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-2 text-center">
            {t('resetPassword')}
          </h2>

          {/* Instructions */}
          <p className="text-sm text-muted-foreground text-center mb-6">
            {t('resetPasswordInstructions')}
          </p>

          <ResetPasswordForm token={token} onSuccess={handleResetSuccess} />
        </div>

        {/* Help Text */}
        <div className="bg-muted/50 border border-border rounded-2xl p-4 text-sm text-center">
          <p className="text-muted-foreground">
            {t('resetPasswordHelp')}
          </p>
        </div>
      </div>
    </div>
  );
}
