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
