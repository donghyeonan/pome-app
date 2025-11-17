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
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{clinic.name}</h1>
              {clinic.verified && (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{clinic.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>{t('verifiedClinic')}</span>
          </div>
        )}
      </div>

      {/* Image Gallery */}
      {clinic.photos && clinic.photos.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('photos')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {clinic.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-video bg-muted rounded-lg flex items-center justify-center"
                >
                  <p className="text-sm text-muted-foreground">
                    Photo {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* About */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3">{t('about')}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {clinic.description}
          </p>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3">{t('specialties')}</h2>
          <div className="flex flex-wrap gap-2">
            {clinic.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 rounded-full bg-muted text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('contact')}</h2>
          <div className="space-y-3">
            {/* Phone */}
            {clinic.phoneNumber && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('phone')}</p>
                  <a
                    href={`tel:${clinic.phoneNumber}`}
                    className="text-primary hover:underline"
                  >
                    {clinic.phoneNumber}
                  </a>
                </div>
              </div>
            )}

            {/* Website */}
            {clinic.websiteUrl && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('website')}</p>
                  <a
                    href={clinic.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {clinic.websiteUrl.replace(/^https?:\/\//, '')}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t('location')}</p>
                <p>{clinic.location}</p>
              </div>
            </div>

            {/* Kakao Map Link */}
            {clinic.kakaoMapLink && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
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
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('openingHours')}
            </h2>
            <div className="space-y-2">
              {Object.entries(clinic.openingHours).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span className="capitalize font-medium">{day}</span>
                  <span className="text-muted-foreground">{hours}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Treatments */}
      {availableTreatments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('availableTreatments')}</h2>
          <p className="text-muted-foreground mb-4">
            {availableTreatments.length} treatments available at this clinic
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p className="text-sm text-muted-foreground mt-2 px-2">
                      Price: ₩{(clinicTreatment.price / 1000).toFixed(0)}K
                    </p>
                  )}
                  {clinicTreatment?.availability === 'limited' && (
                    <p className="text-sm text-yellow-600 mt-1 px-2">
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
