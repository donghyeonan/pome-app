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
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 sm:mb-8 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-2xl lg:max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 lg:mb-4 transition-all">
              {t('title')}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Search Input */}
      <div className="sticky top-16 sm:top-20 z-40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-background/95 backdrop-blur-sm border-b border-transparent mb-6 sm:mb-8">
        <div className="max-w-2xl mx-auto">
          <SearchInput
            placeholder={t('searchPlaceholder')}
            onSearch={handleSearch}
            showAutocomplete={false}
          />
        </div>
      </div>

      {/* Featured Clinics Section */}
      <section className="mb-8 sm:mb-12 lg:mb-16">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            {t('featuredClinics')}
          </h2>
          <Link
            href="/clinics"
            className="flex items-center gap-1 text-sm lg:text-base font-medium text-primary hover:underline touch-manipulation min-h-[44px] items-center transition-colors"
          >
            {tCommon('seeAll')}
            <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
          </Link>
        </div>

        {/* Horizontal scrollable container - optimized for touch */}
        <div className="overflow-x-auto -mx-4 px-4 pb-4 scrollbar-hide lg:overflow-visible lg:mx-0 lg:px-0">
          <div className="flex gap-3 sm:gap-4 lg:gap-5 xl:gap-6 min-w-min lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:min-w-0">
            {featuredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="w-[260px] sm:w-[280px] lg:w-auto flex-shrink-0"
              >
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
      <section className="mb-8 sm:mb-12 lg:mb-16">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            {t('popularProcedures')}
          </h2>
          <Link
            href="/treatments"
            className="flex items-center gap-1 text-sm lg:text-base font-medium text-primary hover:underline touch-manipulation min-h-[44px] items-center transition-colors"
          >
            {tCommon('seeAll')}
            <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
          </Link>
        </div>

        {/* Grid layout: 1 column on mobile, 2 on tablet, 4 on desktop, 5 on xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
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
