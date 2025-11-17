'use client';

import { useTranslations } from 'next-intl';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Treatment } from '@/types';
import { cn } from '@/lib/utils';

interface TreatmentCardProps {
  treatment: Treatment;
  highlighted?: boolean;
  onClick?: () => void;
}

export function TreatmentCard({
  treatment,
  highlighted = false,
  onClick,
}: TreatmentCardProps) {
  const t = useTranslations('treatments');

  // Dynamically get the Lucide icon component
  const IconComponent = (
    LucideIcons[treatment.icon as keyof typeof LucideIcons] ||
    LucideIcons.Sparkles
  ) as React.ComponentType<{ className?: string }>;

  // Format price range
  const formatPrice = (amount: number, currency: string) => {
    if (currency === 'KRW') {
      return `₩${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const priceRangeText = `${formatPrice(treatment.priceRange.min, treatment.priceRange.currency)} - ${formatPrice(treatment.priceRange.max, treatment.priceRange.currency)}`;

  return (
    <Card
      className={cn(
        'overflow-hidden cursor-pointer transition-all duration-200',
        'hover:shadow-lg hover:scale-[1.02]',
        'active:scale-[0.98]',
        highlighted && 'ring-2 ring-primary ring-offset-2'
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex-shrink-0 rounded-xl p-3',
              highlighted
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <IconComponent className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">
              {treatment.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {treatment.description}
            </p>

            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-primary">
                {priceRangeText}
              </span>
              <span className="text-xs text-muted-foreground">
                {treatment.duration}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
