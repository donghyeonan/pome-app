import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

export default function ClinicNotFound() {
  const t = useTranslations('errors');
  const tClinics = useTranslations('clinics');
  const tCommon = useTranslations('common');

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
            <Building2 className="h-16 w-16 text-gray-400 dark:text-gray-600" />
          </div>
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {tClinics('noClinics')}
        </h1>
        
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          {t('tryAgainLater')}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/clinics">
              {tCommon('back')} to {tClinics('title')}
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              {t('backToHome')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
