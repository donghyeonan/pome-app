import { useTranslations } from 'next-intl';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { PageLayout } from '@/components/layout/page-layout';
import { ProfileContent } from '@/components/profile/profile-content';

export default function ProfilePage() {
  const t = useTranslations('profile');

  return (
    <ProtectedRoute>
      <PageLayout title={t('title')}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            {t('title')}
          </h1>
          <ProfileContent />
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
