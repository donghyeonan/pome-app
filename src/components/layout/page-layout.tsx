'use client';

import React from 'react';
import { Header } from './header';
import { BottomNav } from './bottom-nav';

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
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {showHeader && <Header title={title} />}
      
      <main className={`${showBottomNav ? 'pb-20' : ''} ${showHeader ? 'pt-16' : ''}`}>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {children}
        </div>
      </main>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
}
