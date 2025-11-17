'use client';

import { useTranslations } from 'next-intl';
import * as LucideIcons from 'lucide-react';
import { ChevronRight, Building2 } from 'lucide-react';
import { Treatment } from '@/types';
import { cn } from '@/lib/utils';

interface ProcedureListItemProps {
  treatment: Treatment;
  showClinicCount?: boolean;
  clinicCount?: number;
  onClick?: () => void;
}

export function ProcedureListItem({
  treatment,
  showClinicCount = false,
  clinicCount,
  onClick,
}: ProcedureListItemProps) {
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
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl',
        'bg-card border border-border',
        'cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:border-primary/50',
        'active:scale-[0.98]'
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0 rounded-lg bg-muted p-2.5">
        <IconComponent className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-base mb-0.5 line-clamp-1">
          {treatment.name}
        </h4>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{priceRangeText}</span>
          {showClinicCount && clinicCount !== undefined && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                <span>
                  {clinicCount} {clinicCount === 1 ? 'clinic' : 'clinics'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </div>
  );
}
