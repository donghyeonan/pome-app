'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { ThemeSwitcher } from './theme-switcher';
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
    <div className="space-y-4 sm:space-y-6">
      {/* Personal Information Card */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('personalInfo')}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {t('accountSettings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div>
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
              {t('name')}
            </label>
            <p className="text-sm sm:text-base mt-1">{user.name}</p>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
              {t('email')}
            </label>
            <p className="text-sm sm:text-base mt-1 break-all">{user.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Language Preference Card */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">
            {t('languagePreference')}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {t('languageDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LanguageSwitcher />
        </CardContent>
      </Card>

      {/* Theme Preference Card */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">
            {t('themePreference')}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {t('themeDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSwitcher />
        </CardContent>
      </Card>

      {/* User Preferences Card */}
      {(user.gender ||
        user.ageRange ||
        user.skinType ||
        user.treatmentGoals) && (
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">
              {t('preferences')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {user.gender && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {t('gender')}
                </label>
                <p className="text-sm sm:text-base mt-1 capitalize">
                  {t(`genderOptions.${user.gender}`)}
                </p>
              </div>
            )}
            {user.ageRange && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {t('ageRange')}
                </label>
                <p className="text-sm sm:text-base mt-1">
                  {t(`ageRangeOptions.${user.ageRange}`)}
                </p>
              </div>
            )}
            {user.skinType && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {t('skinType')}
                </label>
                <p className="text-sm sm:text-base mt-1 capitalize">
                  {t(`skinTypeOptions.${user.skinType}`)}
                </p>
              </div>
            )}
            {user.treatmentGoals && user.treatmentGoals.length > 0 && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {t('treatmentGoals')}
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                  {user.treatmentGoals.map((goal) => (
                    <span
                      key={goal}
                      className="px-2.5 sm:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm"
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
        <CardContent className="pt-4 sm:pt-6">
          <Button
            variant="destructive"
            className="w-full min-h-[44px] touch-manipulation"
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
