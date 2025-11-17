'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as LucideIcons from 'lucide-react';
import { ClinicCard } from '@/components/cards/clinic-card';
import { Card, CardContent } from '@/components/ui/card';
import { SaveButton } from '@/components/treatments/save-button';
import { Treatment, Clinic, ClinicTreatment } from '@/types';

interface TreatmentDetailContentProps {
  treatment: Treatment;
  offeringClinics: Clinic[];
  clinicTreatmentData: ClinicTreatment[];
}

export function TreatmentDetailContent({
  treatment,
  offeringClinics,
  clinicTreatmentData,
}: TreatmentDetailContentProps) {
  const t = useTranslations('treatments');
  const router = useRouter();

  // Get the icon component
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

  const handleClinicClick = (clinicId: string) => {
    router.push(`/clinics/${clinicId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Treatment Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 rounded-2xl bg-primary/10 p-4">
            <IconComponent className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{treatment.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-semibold text-primary text-lg">
                {priceRangeText}
              </span>
              <span className="text-muted-foreground">
                {treatment.duration}
              </span>
            </div>
          </div>
          <SaveButton itemType="treatment" itemId={treatment.id} />
        </div>
      </div>

      {/* Description */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3">{t('description')}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {treatment.description}
          </p>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Duration */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">{t('duration')}</h3>
            <p className="text-muted-foreground">{treatment.duration}</p>
          </CardContent>
        </Card>

        {/* Recovery Time */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">{t('recoveryTime')}</h3>
            <p className="text-muted-foreground">{treatment.recoveryTime}</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3">{t('categories')}</h2>
          <div className="flex flex-wrap gap-2">
            {treatment.categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 rounded-full bg-muted text-sm capitalize"
              >
                {category.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risks and Considerations */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3">
            {t('risks')} & {t('considerations')}
          </h2>
          <ul className="space-y-2">
            {treatment.risks.map((risk, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-muted-foreground"
              >
                <span className="text-primary mt-1">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Suitable For */}
      {treatment.suitableFor && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('suitableFor')}</h2>
            <div className="space-y-4">
              {/* Skin Types */}
              {treatment.suitableFor.skinTypes.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-2">Skin Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {treatment.suitableFor.skinTypes.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-1 rounded-lg bg-muted text-xs capitalize"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Age Ranges */}
              {treatment.suitableFor.ageRanges.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-2">Age Ranges</h3>
                  <div className="flex flex-wrap gap-2">
                    {treatment.suitableFor.ageRanges.map((range) => (
                      <span
                        key={range}
                        className="px-2 py-1 rounded-lg bg-muted text-xs"
                      >
                        {range}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Goals */}
              {treatment.suitableFor.goals.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-2">Treatment Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {treatment.suitableFor.goals.map((goal) => (
                      <span
                        key={goal}
                        className="px-2 py-1 rounded-lg bg-muted text-xs capitalize"
                      >
                        {goal.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Before/After Images */}
      {treatment.beforeAfterImages && treatment.beforeAfterImages.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('beforeAfter')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {treatment.beforeAfterImages.map((images, index) => (
                <div key={index} className="space-y-2">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Before & After Image {index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clinics Offering This Treatment */}
      {offeringClinics.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('clinicsOffering')}</h2>
          <p className="text-muted-foreground mb-4">
            {offeringClinics.length} clinics offer this treatment
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offeringClinics.map((clinic) => {
              const clinicTreatment = clinicTreatmentData.find(
                (ct) => ct.clinicId === clinic.id && ct.treatmentId === treatment.id
              );
              return (
                <div key={clinic.id}>
                  <ClinicCard
                    clinic={clinic}
                    onClick={() => handleClinicClick(clinic.id)}
                  />
                  {clinicTreatment?.price && (
                    <p className="text-sm text-muted-foreground mt-2 px-2">
                      Price at this clinic: ₩
                      {(clinicTreatment.price / 1000).toFixed(0)}K
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
