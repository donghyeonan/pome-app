'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export function Header({ title, showBackButton }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  // Determine if we should show the back button
  const shouldShowBack =
    showBackButton || (pathname !== '/' && pathname.split('/').length > 2);

  const handleBack = () => {
    router.back();
  };

  const handleLogout = async () => {
    // NextAuth signOut handles redirect to '/' automatically
    await logout();
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname.match(/^\/[a-z]{2}\/?$/);
    }
    return pathname.includes(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between max-w-7xl">
        {/* Left section - Back button or Logo */}
        <div className="flex items-center gap-3 lg:gap-8">
          {shouldShowBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label={t('common.back')}
              className="min-h-[44px] min-w-[44px] touch-manipulation hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          ) : (
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer"
              onClick={() => router.push('/')}
            >
              <Image
                src="/pome-logo.svg"
                alt="Pome"
                width={32}
                height={32}
                className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
              />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold">
                Pome
              </span>
            </div>
          )}

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          {!shouldShowBack && isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className={
                  isActivePath('/') &&
                  !isActivePath('/treatments') &&
                  !isActivePath('/clinics')
                    ? 'bg-accent'
                    : ''
                }
              >
                {t('nav.home')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/treatments')}
                className={isActivePath('/treatments') ? 'bg-accent' : ''}
              >
                {t('nav.procedures')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/clinics')}
                className={isActivePath('/clinics') ? 'bg-accent' : ''}
              >
                {t('nav.clinics')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/saved')}
                className={isActivePath('/saved') ? 'bg-accent' : ''}
              >
                {t('nav.saved')}
              </Button>
            </nav>
          )}
        </div>

        {/* Center section - Title (hidden on mobile if back button shown) */}
        {title && (
          <h1 className="hidden sm:block lg:hidden absolute left-1/2 transform -translate-x-1/2 text-base sm:text-lg font-semibold">
            {title}
          </h1>
        )}

        {/* Right section - User menu or Login/Register */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full min-h-[44px] min-w-[44px] touch-manipulation hover:bg-accent transition-colors"
                  aria-label={t('nav.menu')}
                >
                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleProfileClick}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('nav.profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('auth.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => router.push('/login')}
                className="hidden sm:inline-flex"
              >
                {t('auth.login')}
              </Button>
              <Button
                onClick={() => router.push('/register')}
                size="sm"
              >
                {t('auth.register')}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
