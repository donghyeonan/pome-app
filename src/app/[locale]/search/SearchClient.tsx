'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { SearchInput } from '@/components/search/search-input';
import { TreatmentCard } from '@/components/cards/treatment-card';
import { ClinicCard } from '@/components/cards/clinic-card';
import type { Treatment, Clinic } from '@prisma/client';

interface SearchClientProps {
  treatments: Treatment[];
  clinics: Clinic[];
  query: string;
}

export default function SearchClient({
  treatments,
  clinics,
  query,
}: SearchClientProps) {
  const t = useTranslations('search');
  const router = useRouter();

  const totalResults = treatments.length + clinics.length;

  const handleSearch = useCallback(
    (newQuery: string) => {
      if (newQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(newQuery.trim())}`);
      } else {
        router.push('/search');
      }
    },
    [router]
  );

  const handleTreatmentClick = (treatmentId: string) => {
    router.push(`/treatments/${treatmentId}`);
  };

  const handleClinicClick = (clinicId: string) => {
    router.push(`/clinics/${clinicId}`);
  };

  return (
    <PageLayout title={t('title')}>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        {t('title')}
      </h1>

      <div className="space-y-4 sm:space-y-6">
        {/* Search Input */}
        <SearchInput
          defaultValue={query}
          onSearch={handleSearch}
          placeholder={t('searchPlaceholder')}
          showAutocomplete={false}
        />

        {/* Results Header */}
        {query && (
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-base sm:text-lg font-semibold">
              {t('resultsFor', { query })}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('resultsCount', { count: totalResults })}
            </p>
          </div>
        )}

        {/* Empty State */}
        {query && totalResults === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-base sm:text-lg text-muted-foreground mb-2">
              {t('noResults', { query })}
            </p>
            <p className="text-sm text-muted-foreground">{t('tryDifferent')}</p>
          </div>
        )}

        {/* Treatments Section */}
        {treatments.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold">
              {t('treatmentsSection')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {treatments.map((treatment) => (
                <TreatmentCard
                  key={treatment.id}
                  treatment={treatment}
                  onClick={() => handleTreatmentClick(treatment.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Clinics Section */}
        {clinics.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold">
              {t('clinicsSection')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {clinics.map((clinic) => (
                <ClinicCard
                  key={clinic.id}
                  clinic={clinic}
                  onClick={() => handleClinicClick(clinic.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
