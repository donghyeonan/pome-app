'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LoginForm } from '@/components/forms/login-form';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
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

  const handleLoginSuccess = () => {
    // Redirect to intended page or homepage
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

  // Don't show login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Pome</h1>
          <p className="text-muted-foreground">{t('loginRequired')}</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {t('login')}
          </h2>

          {/* Google Sign-In Button */}
          <div className="space-y-4">
            <GoogleSignInButton />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t('orDivider')}
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <LoginForm onSuccess={handleLoginSuccess} callbackUrl={redirectTo} />
          </div>
        </div>

        {/* Registration Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t('noAccount')} </span>
          <Link
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            {t('register')}
          </Link>
        </div>

        {/* Demo Credentials Info */}
        <div className="bg-muted/50 border border-border rounded-2xl p-4 text-sm">
          <p className="font-medium mb-2">{t('demoCredentials')}</p>
          <p className="text-muted-foreground">
            {t('demoEmail')}{' '}
            <span className="font-mono">sarah.kim@example.com</span>
          </p>
          <p className="text-muted-foreground">
            {t('demoPassword')} <span className="font-mono">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
