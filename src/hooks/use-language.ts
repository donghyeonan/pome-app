'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import type { Locale } from '@/i18n';

const LANGUAGE_STORAGE_KEY = 'preferredLanguage';

/**
 * Language Hook
 * 
 * Provides language switching functionality with localStorage persistence
 * and URL locale management.
 * 
 * @hook
 * @example
 * ```tsx
 * function LanguageSelector() {
 *   const { currentLocale, changeLanguage } = useLanguage();
 * 
 *   return (
 *     <select 
 *       value={currentLocale} 
 *       onChange={(e) => changeLanguage(e.target.value as Locale)}
 *     >
 *       <option value="en">English</option>
 *       <option value="ko">한국어</option>
 *       <option value="zh">中文</option>
 *       <option value="ja">日本語</option>
 *     </select>
 *   );
 * }
 * ```
 * 
 * Features:
 * - Automatic localStorage persistence of language preference
 * - URL locale management (updates pathname with new locale)
 * - Router refresh to apply changes immediately
 * - Retrieval of stored language preference
 * 
 * Available Properties:
 * - `currentLocale` - Current active locale (en, ko, zh, ja)
 * - `changeLanguage` - Function to change the application language
 * - `getStoredLanguage` - Function to retrieve stored language preference
 * 
 * @returns {Object} Language utilities
 */
export function useLanguage() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  // Persist language preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLocale);
    }
  }, [currentLocale]);

  const changeLanguage = (newLocale: Locale) => {
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLocale);
    }

    // Update URL with new locale
    // Remove current locale from pathname if it exists
    const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, '');

    // Add new locale prefix (unless it's the default 'en')
    const newPath =
      newLocale === 'en'
        ? pathnameWithoutLocale || '/'
        : `/${newLocale}${pathnameWithoutLocale || '/'}`;

    router.push(newPath);
    router.refresh();
  };

  const getStoredLanguage = (): Locale | null => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return stored as Locale | null;
    }
    return null;
  };

  return {
    currentLocale,
    changeLanguage,
    getStoredLanguage,
  };
}
