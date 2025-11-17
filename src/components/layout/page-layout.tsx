'use client';

import React from 'react';
import { Header } from './header';
import { BottomNav } from './bottom-nav';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
  title?: string;
}

export function PageLayout({
  children,
  showHeader = true,
  showBottomNav = true,
  title,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header title={title} />}
      
      <main className={cn(
        showBottomNav ? 'pb-20 sm:pb-24 lg:pb-8' : '',
        showHeader ? 'pt-16 sm:pt-20' : ''
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
          {children}
        </div>
      </main>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
}
