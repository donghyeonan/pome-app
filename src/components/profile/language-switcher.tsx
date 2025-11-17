'use client';

import { useTranslations } from 'next-intl';
import { useLanguage } from '@/hooks/use-language';
import { locales, type Locale } from '@/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSwitcher() {
  const t = useTranslations('profile');
  const { currentLocale, changeLanguage } = useLanguage();

  const languageNames: Record<Locale, string> = {
    en: t('languageOptions.en'),
    ko: t('languageOptions.ko'),
    zh: t('languageOptions.zh'),
    ja: t('languageOptions.ja'),
  };

  return (
    <Select value={currentLocale} onValueChange={(value) => changeLanguage(value as Locale)}>
      <SelectTrigger id="language-select" className="w-full">
        <SelectValue placeholder={t('language')} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {languageNames[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
