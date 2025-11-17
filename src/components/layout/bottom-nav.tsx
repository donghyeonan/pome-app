'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, Building2, Sparkles, Bookmark, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  protected: boolean;
}

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  // Remove locale prefix from pathname for comparison
  const currentPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  const navItems: NavItem[] = [
    {
      href: '/',
      label: t('home'),
      icon: Home,
      protected: false,
    },
    {
      href: '/treatments',
      label: t('procedures'),
      icon: Sparkles,
      protected: true,
    },
    {
      href: '/clinics',
      label: t('clinics'),
      icon: Building2,
      protected: true,
    },
    {
      href: '/saved',
      label: t('saved'),
      icon: Bookmark,
      protected: true,
    },
    {
      href: '/profile',
      label: t('profile'),
      icon: User,
      protected: true,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-2 max-w-7xl">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]',
                  active
                    ? 'text-primary'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                )}
                aria-label={item.label}
              >
                <Icon className={cn('h-5 w-5', active && 'stroke-[2.5]')} />
                <span className={cn('text-xs', active && 'font-semibold')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
