'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MapPin, Star, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Clinic } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Props for the ClinicCard component
 */
interface ClinicCardProps {
  /** Clinic data to display */
  clinic: Clinic;
  /** Optional click handler for the card */
  onClick?: () => void;
}

/**
 * Clinic Card Component
 * 
 * Displays clinic information in a card format with image, name, location,
 * rating, and verification status.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <ClinicCard clinic={clinicData} />
 * 
 * // With click handler
 * <ClinicCard 
 *   clinic={clinicData} 
 *   onClick={() => router.push(`/clinics/${clinicData.id}`)}
 * />
 * 
 * // In a grid layout
 * <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 *   {clinics.map(clinic => (
 *     <ClinicCard key={clinic.id} clinic={clinic} />
 *   ))}
 * </div>
 * ```
 * 
 * Features:
 * - Optimized Next.js Image with aspect-video ratio
 * - Name and location display with icons
 * - Star rating with review count
 * - Verified badge for verified clinics
 * - Hover effects with image zoom and scale animations
 * - Touch-friendly interactions
 * - Responsive sizing
 * 
 * Translation Keys Used:
 * - `clinics.verified` - Verified badge aria-label
 * - `clinics.reviews` - Reviews count label
 * 
 * @param {ClinicCardProps} props - Component props
 * @returns {JSX.Element} The clinic card component
 */
export function ClinicCard({ clinic, onClick }: ClinicCardProps) {
  const t = useTranslations('clinics');

  return (
    <Card
      className={cn(
        'overflow-hidden cursor-pointer transition-all duration-200',
        'hover:shadow-lg hover:shadow-primary/5',
        'lg:hover:scale-[1.02]',
        'active:scale-[0.98]',
        'touch-manipulation',
        'group'
      )}
      onClick={onClick}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={clinic.imageUrl}
          alt={clinic.name}
          fill
          className="object-cover transition-transform duration-300 lg:group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>

      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
            {clinic.name}
          </h3>
          {clinic.verified && (
            <BadgeCheck
              className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0"
              aria-label={t('verified')}
            />
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-2">
          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="line-clamp-1">{clinic.location}</span>
        </div>

        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-xs sm:text-sm">
            {clinic.rating.toFixed(1)}
          </span>
          {clinic.reviewCount && (
            <span className="text-xs sm:text-sm text-muted-foreground">
              ({clinic.reviewCount} {t('reviews')})
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
