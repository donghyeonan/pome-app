'use client';

import { useTranslations } from 'next-intl';
import * as LucideIcons from 'lucide-react';
import { ChevronRight, Building2 } from 'lucide-react';
import { Treatment } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Props for the ProcedureListItem component
 */
interface ProcedureListItemProps {
  /** Treatment data to display */
  treatment: Treatment;
  /** Whether to show the number of clinics offering this treatment */
  showClinicCount?: boolean;
  /** Number of clinics offering this treatment */
  clinicCount?: number;
  /** Optional click handler for the item */
  onClick?: () => void;
}

/**
 * Procedure List Item Component
 * 
 * Displays treatment information in a compact list format, suitable for
 * search results, autocomplete dropdowns, or list views.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <ProcedureListItem treatment={treatmentData} />
 * 
 * // With clinic count
 * <ProcedureListItem 
 *   treatment={treatmentData} 
 *   showClinicCount={true}
 *   clinicCount={5}
 * />
 * 
 * // With click handler
 * <ProcedureListItem 
 *   treatment={treatmentData} 
 *   onClick={() => router.push(`/treatments/${treatmentData.id}`)}
 * />
 * 
 * // In a list
 * <div className="space-y-2">
 *   {treatments.map(treatment => (
 *     <ProcedureListItem 
 *       key={treatment.id} 
 *       treatment={treatment}
 *       showClinicCount={true}
 *       clinicCount={getClinicCount(treatment.id)}
 *     />
 *   ))}
 * </div>
 * ```
 * 
 * Features:
 * - Compact horizontal layout
 * - Dynamic Lucide icon based on treatment.icon
 * - Treatment name and price range
 * - Optional clinic count with icon
 * - Chevron indicator for clickable items
 * - Hover effects with border highlight
 * - Touch-friendly interactions
 * 
 * @param {ProcedureListItemProps} props - Component props
 * @returns {JSX.Element} The procedure list item component
 */
export function ProcedureListItem({
  treatment,
  showClinicCount = false,
  clinicCount,
  onClick,
}: ProcedureListItemProps) {
  const t = useTranslations('treatments');

  // Dynamically get the Lucide icon component
  const IconComponent = (LucideIcons[
    treatment.icon as keyof typeof LucideIcons
  ] || LucideIcons.Sparkles) as React.ComponentType<{ className?: string }>;

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
