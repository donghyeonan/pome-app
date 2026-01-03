'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { BadgeCheck } from 'lucide-react';
import type { Clinic as PrismaClinic } from '@prisma/client';
import type { Clinic as LegacyClinic } from '@/types';

// Support both Prisma and legacy mock data types
type ClinicData = PrismaClinic | LegacyClinic;

/**
 * Props for the ClinicCard component
 */
interface ClinicCardProps {
  /** Clinic data to display */
  clinic: ClinicData;
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
    <div
      className="flex flex-col cursor-pointer group"
      onClick={onClick}
    >
      {/* Image Section with Verified Badge Overlay */}
      <div className="relative h-48 overflow-hidden rounded-2xl bg-muted">
        {clinic.imageUrl ? (
          <Image
            src={clinic.imageUrl}
            alt={clinic.name}
            fill
            className="object-cover"
            sizes="75vw"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <span className="text-4xl">🏥</span>
          </div>
        )}

        {/* Verified Badge - Overlaid on image at bottom-left */}
        {clinic.verified && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-[#D90429]/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <BadgeCheck className="h-4 w-4" />
            <span>{t('verified')}</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="pt-2">
        <h3 className="text-base font-semibold truncate">
          {clinic.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {clinic.location}
        </p>
      </div>
    </div>
  );
}
