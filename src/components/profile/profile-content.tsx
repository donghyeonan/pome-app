'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { User, LogOut } from 'lucide-react';

export function ProfileContent() {
  const t = useTranslations('profile');
  const tAuth = useTranslations('auth');
  const { user, logout } = useAuth();
  const { currentLocale } = useLanguage();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // Redirect to homepage with current locale
    router.push(`/${currentLocale}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('personalInfo')}
          </CardTitle>
          <CardDescription>{t('accountSettings')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t('name')}
            </label>
            <p className="text-base mt-1">{user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t('email')}
            </label>
            <p className="text-base mt-1">{user.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Language Preference Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('languagePreference')}</CardTitle>
          <CardDescription>
            Choose your preferred language for the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LanguageSwitcher />
        </CardContent>
      </Card>

      {/* User Preferences Card */}
      {(user.gender || user.ageRange || user.skinType || user.treatmentGoals) && (
        <Card>
          <CardHeader>
            <CardTitle>{t('preferences')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.gender && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('gender')}
                </label>
                <p className="text-base mt-1 capitalize">
                  {t(`genderOptions.${user.gender}`)}
                </p>
              </div>
            )}
            {user.ageRange && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('ageRange')}
                </label>
                <p className="text-base mt-1">{t(`ageRangeOptions.${user.ageRange}`)}</p>
              </div>
            )}
            {user.skinType && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('skinType')}
                </label>
                <p className="text-base mt-1 capitalize">
                  {t(`skinTypeOptions.${user.skinType}`)}
                </p>
              </div>
            )}
            {user.treatmentGoals && user.treatmentGoals.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('treatmentGoals')}
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.treatmentGoals.map((goal) => (
                    <span
                      key={goal}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {goal.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Logout Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {tAuth('logout')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
