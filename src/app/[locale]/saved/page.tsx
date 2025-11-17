import { useTranslations } from 'next-intl';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { PageLayout } from '@/components/layout/page-layout';
import { SavedItemsContent } from '@/components/saved/saved-items-content';

export default function SavedPage() {
  const t = useTranslations('saved');

  return (
    <ProtectedRoute>
      <PageLayout title={t('title')}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          {t('title')}
        </h1>
        <SavedItemsContent />
      </PageLayout>
    </ProtectedRoute>
  );
}
