'use client';

import React from 'react';
import { Header } from './header';
import { BottomNav } from './bottom-nav';
import { cn } from '@/lib/utils';

/**
 * Props for the PageLayout component
 */
interface PageLayoutProps {
  /** Content to be rendered within the layout */
  children: React.ReactNode;
  /** Whether to show the header. Defaults to true */
  showHeader?: boolean;
  /** Whether to show the bottom navigation. Defaults to true */
  showBottomNav?: boolean;
  /** Optional title to display in the header */
  title?: string;
}

/**
 * Page Layout Component
 * 
 * A reusable layout wrapper that provides consistent page structure with
 * optional header and bottom navigation.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage with all defaults
 * <PageLayout>
 *   <YourPageContent />
 * </PageLayout>
 * 
 * // Custom configuration
 * <PageLayout 
 *   title="My Page" 
 *   showHeader={true} 
 *   showBottomNav={false}
 * >
 *   <YourPageContent />
 * </PageLayout>
 * ```
 * 
 * Features:
 * - Responsive container with max-width constraints
 * - Automatic padding adjustments based on header/nav visibility
 * - Consistent spacing across all pages
 * - Mobile-first responsive design
 * 
 * @param {PageLayoutProps} props - Component props
 * @returns {JSX.Element} The page layout wrapper
 */
export function PageLayout({
  children,
  showHeader = true,
  showBottomNav = true,
  title,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header title={title} />}

      <main
        className={cn(
          showBottomNav ? 'pb-20 sm:pb-24 lg:pb-8' : '',
          showHeader ? 'pt-16 sm:pt-20' : ''
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
          {children}
        </div>
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}
