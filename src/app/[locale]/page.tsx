'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/page-layout';
import { SearchInput } from '@/components/search/search-input';
import { ClinicCard } from '@/components/cards/clinic-card';
import { TreatmentCard } from '@/components/cards/treatment-card';
import { clinics } from '@/data/clinics';
import { treatments } from '@/data/treatments';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const router = useRouter();

  // Get featured clinics (first 5 verified clinics)
  const featuredClinics = clinics.filter((c) => c.verified).slice(0, 5);

  // Get popular procedures (first 8 treatments)
  const popularProcedures = treatments.slice(0, 8);

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleTreatmentClick = (treatmentId: string) => {
    router.push(`/treatments/${treatmentId}`);
  };

  const handleClinicClick = (clinicId: string) => {
    router.push(`/clinics/${clinicId}`);
  };

  return (
    <PageLayout>
      {/* Hero Banner */}
      <div className="relative -mx-4 -mt-6 mb-8 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
              {t('title')}
            </h1>
            <p className="text-base md:text-lg text-text-secondary-light dark:text-text-secondary-dark">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Search Input */}
      <div className="sticky top-16 z-40 -mx-4 px-4 py-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-transparent mb-8">
        <div className="max-w-2xl mx-auto">
          <SearchInput
            placeholder={t('searchPlaceholder')}
            onSearch={handleSearch}
            showAutocomplete={false}
          />
        </div>
      </div>

      {/* Featured Clinics Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('featuredClinics')}
          </h2>
          <Link
            href="/clinics"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {tCommon('seeAll')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Horizontal scrollable container */}
        <div className="overflow-x-auto -mx-4 px-4 pb-4">
          <div className="flex gap-4 min-w-min">
            {featuredClinics.map((clinic) => (
              <div key={clinic.id} className="w-[280px] flex-shrink-0">
                <ClinicCard
                  clinic={clinic}
                  onClick={() => handleClinicClick(clinic.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Procedures Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('popularProcedures')}
          </h2>
          <Link
            href="/treatments"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {tCommon('seeAll')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid layout: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularProcedures.map((treatment) => (
            <TreatmentCard
              key={treatment.id}
              treatment={treatment}
              onClick={() => handleTreatmentClick(treatment.id)}
            />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
