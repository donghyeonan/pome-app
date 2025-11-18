'use client';

import * as LucideIcons from 'lucide-react';
import { Treatment } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Props for the TreatmentCard component
 */
interface TreatmentCardProps {
  /** Treatment data to display */
  treatment: Treatment;
  /** Whether to highlight the card (for featured items) */
  highlighted?: boolean;
  /** Optional click handler for the card */
  onClick?: () => void;
}

/**
 * Treatment Card Component
 * 
 * Displays treatment information in a card format with icon, name, description,
 * price range, and duration. Supports highlighted state for featured treatments.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <TreatmentCard treatment={treatmentData} />
 * 
 * // Highlighted/featured treatment
 * <TreatmentCard treatment={treatmentData} highlighted={true} />
 * 
 * // With click handler
 * <TreatmentCard 
 *   treatment={treatmentData} 
 *   onClick={() => router.push(`/treatments/${treatmentData.id}`)}
 * />
 * 
 * // In a grid layout
 * <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 *   {treatments.map(treatment => (
 *     <TreatmentCard key={treatment.id} treatment={treatment} />
 *   ))}
 * </div>
 * ```
 * 
 * Features:
 * - Dynamic Lucide icon based on treatment.icon property
 * - Name and description with text truncation
 * - Price range display with KRW formatting (₩XXK)
 * - Duration display
 * - Highlighted state with ring border
 * - Hover effects and scale animations
 * - Touch-friendly interactions
 * - Responsive sizing
 * 
 * @param {TreatmentCardProps} props - Component props
 * @returns {JSX.Element} The treatment card component
 */
export function TreatmentCard({
  treatment,
  highlighted = false,
  onClick,
}: TreatmentCardProps) {
  // Dynamically get the Lucide icon component
  const IconComponent = (LucideIcons[
    treatment.icon as keyof typeof LucideIcons
  ] || LucideIcons.Sparkles) as React.ComponentType<{ className?: string }>;

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl p-4 gap-2 cursor-pointer',
        highlighted
          ? 'bg-[#FFE4E9]'
          : 'bg-white dark:bg-card'
      )}
      onClick={onClick}
    >
      {/* Icon Circle */}
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full',
          highlighted
            ? 'bg-[#D90429] text-white'
            : 'bg-[#FFE4E9] text-[#D90429]'
        )}
      >
        <IconComponent className="h-6 w-6" />
      </div>

      {/* Content */}
      <h3 className="font-semibold text-foreground">
        {treatment.name}
      </h3>
      <p className="text-sm text-muted-foreground mt-auto">
        {treatment.description}
      </p>
    </div>
  );
}
