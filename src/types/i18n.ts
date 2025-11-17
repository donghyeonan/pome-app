/**
 * Type definitions for translation keys
 * 
 * These types provide autocomplete and type safety when using translations
 * throughout the application.
 */

export type TranslationNamespace =
  | 'common'
  | 'nav'
  | 'home'
  | 'auth'
  | 'treatments'
  | 'clinics'
  | 'search'
  | 'saved'
  | 'profile'
  | 'errors'
  | 'validation';

/**
 * Common translation keys
 */
export type CommonKeys =
  | 'save'
  | 'saved'
  | 'unsave'
  | 'cancel'
  | 'confirm'
  | 'delete'
  | 'edit'
  | 'search'
  | 'filter'
  | 'sort'
  | 'loading'
  | 'error'
  | 'retry'
  | 'seeAll'
  | 'back'
  | 'next'
  | 'previous'
  | 'close'
  | 'submit'
  | 'clear'
  | 'apply'
  | 'reset'
  | 'noResults'
  | 'tryAgain';

/**
 * Navigation translation keys
 */
export type NavKeys =
  | 'home'
  | 'procedures'
  | 'treatments'
  | 'clinics'
  | 'saved'
  | 'profile'
  | 'search'
  | 'menu';

/**
 * Helper type for nested translation keys
 */
export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

/**
 * Language options
 */
export type LanguageOption = {
  code: 'en' | 'ko' | 'zh' | 'ja';
  name: string;
  nativeName: string;
};

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
];
