'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ForgotPasswordForm } from '@/components/forms/forgot-password-form';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Pome</h1>
          <p className="text-muted-foreground">{t('resetYourPassword')}</p>
        </div>

        {/* Forgot Password Form Card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-2 text-center">
            {t('forgotPassword')}
          </h2>

          {/* Instructions */}
          <p className="text-sm text-muted-foreground text-center mb-6">
            {t('forgotPasswordInstructions')}
          </p>

          <ForgotPasswordForm />
        </div>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('backToLogin')}
          </Link>
        </div>

        {/* Help Text */}
        <div className="bg-muted/50 border border-border rounded-2xl p-4 text-sm text-center">
          <p className="text-muted-foreground">
            {t('forgotPasswordHelp')}
          </p>
        </div>
      </div>
    </div>
  );
}
