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
  const { user, isAuthenticated, logout } = useAuth();

  // Determine if we should show the back button
  const shouldShowBack = showBackButton || (pathname !== '/' && pathname.split('/').length > 2);

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card-light dark:bg-card-dark border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Left section - Back button or Logo */}
        <div className="flex items-center gap-3">
          {shouldShowBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label={t('common.back')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Image
                src="/pome-logo.svg"
                alt="Pome"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Pome
              </span>
            </div>
          )}
        </div>

        {/* Center section - Title */}
        {title && (
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            {title}
          </h1>
        )}

        {/* Right section - User menu */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label={t('nav.menu')}
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-text-secondary-light dark:text-text-secondary-dark">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('nav.profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('auth.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
