'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Theme Switcher Component
 * 
 * A dropdown selector that allows users to change the application theme
 * between light mode, dark mode, and system preference.
 * 
 * @component
 * @example
 * ```tsx
 * <ThemeSwitcher />
 * ```
 * 
 * Features:
 * - Three theme options: light, dark, system
 * - Persists selection in localStorage
 * - Immediate theme update
 * - Prevents hydration mismatch with mounted state
 * - System option respects OS theme preference
 * 
 * Theme Options:
 * - Light: Force light mode
 * - Dark: Force dark mode
 * - System: Follow OS preference
 * 
 * Translation Keys Used:
 * - `profile.theme` - Label for the selector
 * - `profile.themeOptions.light` - Light theme option
 * - `profile.themeOptions.dark` - Dark theme option
 * - `profile.themeOptions.system` - System theme option
 * 
 * @returns {JSX.Element | null} The theme switcher dropdown, or null if not mounted
 */
export function ThemeSwitcher() {
  const t = useTranslations('profile');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themeOptions = {
    light: t('themeOptions.light'),
    dark: t('themeOptions.dark'),
    system: t('themeOptions.system'),
  };

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger id="theme-select" className="w-full">
        <SelectValue placeholder={t('theme')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">{themeOptions.light}</SelectItem>
        <SelectItem value="dark">{themeOptions.dark}</SelectItem>
        <SelectItem value="system">{themeOptions.system}</SelectItem>
      </SelectContent>
    </Select>
  );
}
