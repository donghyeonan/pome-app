'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { RegisterForm } from '@/components/forms/register-form';
import { useAuth } from '@/hooks/use-auth';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  // Get the redirect URL from query params (where user was trying to go)
  const redirectTo = searchParams.get('redirect') || '/';

  // If already authenticated, redirect to intended page or home
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  const handleRegisterSuccess = () => {
    // Redirect to intended page or homepage (handled by RegisterForm)
    router.push(redirectTo);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  // Don't show register form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Pome</h1>
          <p className="text-muted-foreground">{t('createAccount')}</p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {t('register')}
          </h2>

          <RegisterForm onSuccess={handleRegisterSuccess} />
        </div>

        {/* Login Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t('alreadyHaveAccount')} </span>
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            {t('login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
