'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as LucideIcons from 'lucide-react';
import { Treatment } from '@/types';
import { Card } from '@/components/ui/card';

interface SearchAutocompleteProps {
  query: string;
  results: Treatment[];
  onSelect: (treatment: Treatment) => void;
  isVisible: boolean;
}

export function SearchAutocomplete({
  query,
  results,
  onSelect,
  isVisible,
}: SearchAutocompleteProps) {
  const t = useTranslations('search');
  const router = useRouter();

  if (!isVisible || !query.trim() || results.length === 0) {
    return null;
  }

  // Limit to 10 results
  const limitedResults = results.slice(0, 10);

  const handleClick = (treatment: Treatment) => {
    onSelect(treatment);
    router.push(`/treatments/${treatment.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, treatment: Treatment) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(treatment);
    }
  };

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-[400px] overflow-y-auto shadow-lg">
      <div className="p-2">
        <div className="text-xs text-muted-foreground px-3 py-2 font-medium">
          {t('suggestions')}
        </div>
        <div className="space-y-1">
          {limitedResults.map((treatment) => {
            const IconComponent = (LucideIcons[
              treatment.icon as keyof typeof LucideIcons
            ] || LucideIcons.Sparkles) as React.ComponentType<{ className?: string }>;

            return (
              <div
                key={treatment.id}
                role="button"
                tabIndex={0}
                onClick={() => handleClick(treatment)}
                onKeyDown={(e) => handleKeyDown(e, treatment)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {treatment.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {treatment.categories.slice(0, 2).join(', ')}
                  </p>
                </div>
                <div className="flex-shrink-0 text-xs text-muted-foreground">
                  {treatment.priceRange.currency === 'KRW'
                    ? `₩${(treatment.priceRange.min / 10000).toFixed(0)}만+`
                    : `$${treatment.priceRange.min}+`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
