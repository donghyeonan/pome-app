import { useTranslations } from 'next-intl';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ProfileContent } from '@/components/profile/profile-content';

export default function ProfilePage() {
  const t = useTranslations('profile');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
          <ProfileContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
