'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MapPin, Star, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Clinic } from '@/types';
import { cn } from '@/lib/utils';

interface ClinicCardProps {
  clinic: Clinic;
  onClick?: () => void;
}

export function ClinicCard({ clinic, onClick }: ClinicCardProps) {
  const t = useTranslations('clinics');

  return (
    <Card
      className={cn(
        'overflow-hidden cursor-pointer transition-all duration-200',
        'hover:shadow-lg hover:scale-[1.02]',
        'active:scale-[0.98]'
      )}
      onClick={onClick}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={clinic.imageUrl}
          alt={clinic.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{clinic.name}</h3>
          {clinic.verified && (
            <BadgeCheck
              className="h-5 w-5 text-primary flex-shrink-0"
              aria-label={t('verified')}
            />
          )}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">{clinic.location}</span>
        </div>

        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-sm">{clinic.rating.toFixed(1)}</span>
          {clinic.reviewCount && (
            <span className="text-sm text-muted-foreground">
              ({clinic.reviewCount} {t('reviews')})
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
