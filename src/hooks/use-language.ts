'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import type { Locale } from '@/i18n';

const LANGUAGE_STORAGE_KEY = 'preferredLanguage';

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
    const newPath = newLocale === 'en' 
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
