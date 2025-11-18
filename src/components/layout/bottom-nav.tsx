'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, Building2, Sparkles, Bookmark, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

/**
 * Navigation item configuration
 */
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  protected: boolean;
}

/**
 * Bottom Navigation Bar Component
 * 
 * A fixed bottom navigation bar for mobile and tablet viewports that provides
 * quick access to the main sections of the application.
 * 
 * @component
 * @example
 * ```tsx
 * <BottomNav />
 * ```
 * 
 * Features:
 * - Fixed positioning at bottom of viewport
 * - 5 navigation tabs: Home, Procedures, Clinics, Saved, Profile
 * - Active state highlighting based on current route
 * - Lucide icons for visual clarity
 * - Touch-friendly tap targets (min 44x44px)
 * - Backdrop blur effect for modern appearance
 * - Hidden on desktop viewports (lg breakpoint)
 * - Locale-aware routing
 * 
 * Translation Keys Used:
 * - `nav.home` - Home tab label
 * - `nav.procedures` - Procedures tab label
 * - `nav.clinics` - Clinics tab label
 * - `nav.saved` - Saved tab label
 * - `nav.profile` - Profile tab label
 * 
 * @returns {JSX.Element} The bottom navigation bar
 */
export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');
  const { isAuthenticated, isLoading } = useAuth();

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

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    // If route is protected and user is not authenticated, redirect to login
    if (item.protected && !isAuthenticated && !isLoading) {
      e.preventDefault();
      router.push(`/login?callbackUrl=${encodeURIComponent(item.href)}`);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border lg:hidden">
      <div className="container mx-auto px-2 max-w-7xl">
        <div className="flex items-center justify-around h-16 sm:h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isDisabled = item.protected && !isAuthenticated && !isLoading;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors',
                  'min-w-[60px] min-h-[44px] sm:min-w-[80px]',
                  'touch-manipulation',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                  isDisabled && 'opacity-50'
                )}
                aria-label={item.label}
                aria-disabled={isDisabled}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 sm:h-6 sm:w-6',
                    active && 'stroke-[2.5]'
                  )}
                />
                <span
                  className={cn(
                    'text-xs sm:text-sm',
                    active && 'font-semibold'
                  )}
                >
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
