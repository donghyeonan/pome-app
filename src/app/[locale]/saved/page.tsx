import { useTranslations } from 'next-intl';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SavedItemsContent } from '@/components/saved/saved-items-content';

export default function SavedPage() {
  const t = useTranslations('saved');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
          <SavedItemsContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
