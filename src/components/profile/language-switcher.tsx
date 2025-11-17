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

/**
 * Language Switcher Component
 * 
 * A dropdown selector that allows users to change the application language.
 * The selected language is persisted in localStorage and updates the URL locale.
 * 
 * @component
 * @example
 * ```tsx
 * <LanguageSwitcher />
 * ```
 * 
 * Features:
 * - Displays all available locales from i18n configuration
 * - Shows localized language names
 * - Persists selection in localStorage
 * - Updates URL with new locale
 * - Immediate UI update without page reload
 * 
 * Supported Languages:
 * - English (en)
 * - Korean (ko)
 * - Chinese (zh)
 * - Japanese (ja)
 * 
 * Translation Keys Used:
 * - `profile.language` - Label for the selector
 * - `profile.languageOptions.en` - English language name
 * - `profile.languageOptions.ko` - Korean language name
 * - `profile.languageOptions.zh` - Chinese language name
 * - `profile.languageOptions.ja` - Japanese language name
 * 
 * @returns {JSX.Element} The language switcher dropdown
 */
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
    <Select
      value={currentLocale}
      onValueChange={(value) => changeLanguage(value as Locale)}
    >
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
