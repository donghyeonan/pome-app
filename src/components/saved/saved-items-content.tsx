'use client';

import { useTranslations } from 'next-intl';
import { useSavedItems } from '@/hooks';
import { useAuth } from '@/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreatmentCard } from '@/components/cards/treatment-card';
import { ClinicCard } from '@/components/cards/clinic-card';
import { Button } from '@/components/ui/button';
import { treatments } from '@/data/treatments';
import { clinics } from '@/data/clinics';
import { Bookmark, Sparkles, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SavedItemsContent() {
  const t = useTranslations('saved');
  const tCommon = useTranslations('common');
  const { user } = useAuth();
  const { savedItems, unsaveItem, isLoading } = useSavedItems(user?.id);
  const router = useRouter();

  // Filter saved items by type
  const savedTreatmentIds = savedItems
    .filter((item) => item.itemType === 'treatment')
    .map((item) => item.itemId);

  const savedClinicIds = savedItems
    .filter((item) => item.itemType === 'clinic')
    .map((item) => item.itemId);

  // Get actual treatment and clinic objects
  const savedTreatments = treatments.filter((treatment) =>
    savedTreatmentIds.includes(treatment.id)
  );

  const savedClinics = clinics.filter((clinic) =>
    savedClinicIds.includes(clinic.id)
  );

  const handleRemoveTreatment = (treatmentId: string) => {
    unsaveItem(treatmentId);
  };

  const handleRemoveClinic = (clinicId: string) => {
    unsaveItem(clinicId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">{tCommon('loading')}</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="treatments" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="treatments" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          {t('savedTreatments')}
        </TabsTrigger>
        <TabsTrigger value="clinics" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {t('savedClinics')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="treatments" className="mt-6">
        {savedTreatments.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Bookmark className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t('noSavedTreatments')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {t('startExploring')}
            </p>
            <Button onClick={() => router.push('/treatments')}>
              {t('exploreTreatments')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTreatments.map((treatment) => (
              <div key={treatment.id} className="relative">
                <TreatmentCard
                  treatment={treatment}
                  onClick={() => router.push(`/treatments/${treatment.id}`)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTreatment(treatment.id);
                  }}
                >
                  {tCommon('unsave')}
                </Button>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="clinics" className="mt-6">
        {savedClinics.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Bookmark className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t('noSavedClinics')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {t('startExploring')}
            </p>
            <Button onClick={() => router.push('/clinics')}>
              {t('exploreClinics')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedClinics.map((clinic) => (
              <div key={clinic.id} className="relative">
                <ClinicCard
                  clinic={clinic}
                  onClick={() => router.push(`/clinics/${clinic.id}`)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveClinic(clinic.id);
                  }}
                >
                  {tCommon('unsave')}
                </Button>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
