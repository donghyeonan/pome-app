'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MapPin, Star, Phone, Globe, Clock, CheckCircle2, ExternalLink } from 'lucide-react';
import { TreatmentCard } from '@/components/cards/treatment-card';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SaveButton } from '@/components/treatments/save-button';
import { Clinic, Treatment, ClinicTreatment } from '@/types';

interface ClinicDetailContentProps {
  clinic: Clinic;
  availableTreatments: Treatment[];
  clinicTreatmentData: ClinicTreatment[];
}

export function ClinicDetailContent({
  clinic,
  availableTreatments,
  clinicTreatmentData,
}: ClinicDetailContentProps) {
  const t = useTranslations('clinics');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const handleTreatmentClick = (treatmentId: string) => {
    router.push(`/treatments/${treatmentId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Clinic Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold line-clamp-2">{clinic.name}</h1>
              {clinic.verified && (
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground line-clamp-1">{clinic.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <span className="font-semibold">{clinic.rating.toFixed(1)}</span>
                {clinic.reviewCount && (
                  <span className="text-muted-foreground">
                    ({clinic.reviewCount} {t('reviews')})
                  </span>
                )}
              </div>
              {clinic.priceLevel && (
                <span className="text-muted-foreground">
                  {t(`priceLevel.${clinic.priceLevel}`)}
                </span>
              )}
            </div>
          </div>
          <SaveButton itemType="clinic" itemId={clinic.id} />
        </div>

        {clinic.verified && (
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm">
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{t('verifiedClinic')}</span>
          </div>
        )}
      </div>

      {/* Image Gallery */}
      {clinic.photos && clinic.photos.length > 0 && (
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{t('photos')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
              {clinic.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-video bg-muted rounded-lg flex items-center justify-center"
                >
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Photo {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* About */}
      <Card className="mb-4 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{t('about')}</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {clinic.description}
          </p>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card className="mb-4 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{t('specialties')}</h2>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {clinic.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-2.5 sm:px-3 py-1 rounded-full bg-muted text-xs sm:text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mb-4 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{t('contact')}</h2>
          <div className="space-y-3">
            {/* Phone */}
            {clinic.phoneNumber && (
              <div className="flex items-start gap-2 sm:gap-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('phone')}</p>
                  <a
                    href={`tel:${clinic.phoneNumber}`}
                    className="text-sm sm:text-base text-primary hover:underline min-h-[44px] inline-flex items-center touch-manipulation"
                  >
                    {clinic.phoneNumber}
                  </a>
                </div>
              </div>
            )}

            {/* Website */}
            {clinic.websiteUrl && (
              <div className="flex items-start gap-2 sm:gap-3">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('website')}</p>
                  <a
                    href={clinic.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base text-primary hover:underline flex items-center gap-1 min-h-[44px] touch-manipulation break-all"
                  >
                    {clinic.websiteUrl.replace(/^https?:\/\//, '')}
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="flex items-start gap-2 sm:gap-3">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground">{t('location')}</p>
                <p className="text-sm sm:text-base">{clinic.location}</p>
              </div>
            </div>

            {/* Kakao Map Link */}
            {clinic.kakaoMapLink && (
              <div className="mt-3 sm:mt-4">
                <Button
                  variant="outline"
                  className="w-full min-h-[44px] touch-manipulation"
                  onClick={() => window.open(clinic.kakaoMapLink, '_blank')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('viewOnMap')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours */}
      {clinic.openingHours && (
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              {t('openingHours')}
            </h2>
            <div className="space-y-2">
              {Object.entries(clinic.openingHours).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex justify-between items-center py-2 border-b last:border-0 gap-2"
                >
                  <span className="capitalize font-medium text-sm sm:text-base">{day}</span>
                  <span className="text-muted-foreground text-xs sm:text-sm text-right">{hours}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Treatments */}
      {availableTreatments.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t('availableTreatments')}</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
            {availableTreatments.length} treatments available at this clinic
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {availableTreatments.map((treatment) => {
              const clinicTreatment = clinicTreatmentData.find(
                (ct) => ct.treatmentId === treatment.id && ct.clinicId === clinic.id
              );
              return (
                <div key={treatment.id}>
                  <TreatmentCard
                    treatment={treatment}
                    onClick={() => handleTreatmentClick(treatment.id)}
                  />
                  {clinicTreatment?.price && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 px-2">
                      Price: ₩{(clinicTreatment.price / 1000).toFixed(0)}K
                    </p>
                  )}
                  {clinicTreatment?.availability === 'limited' && (
                    <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-500 mt-1 px-2">
                      Limited availability
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
