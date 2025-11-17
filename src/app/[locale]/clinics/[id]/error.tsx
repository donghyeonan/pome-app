'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClinicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');
  const tCommon = useTranslations('common');
  const tClinics = useTranslations('clinics');
  const router = useRouter();

  useEffect(() => {
    console.error('Clinic detail error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('somethingWentWrong')}
        </h1>
        
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {t('tryAgainLater')}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="w-full sm:w-auto"
          >
            {tCommon('retry')}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push('/clinics')}
            className="w-full sm:w-auto"
          >
            {tCommon('back')} to {tClinics('title')}
          </Button>
        </div>
      </div>
    </div>
  );
}
