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
      {/* Hero Section - Rounded container with background image */}
      <div className="px-4 py-4">
        <div
          className="relative overflow-hidden rounded-3xl min-h-[240px] bg-cover bg-center flex flex-col justify-end"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0) 40%), url('/images/hero/hero-background.jpg')`,
            backgroundColor: '#E5E5E5',
          }}
        >
          <div className="p-5">
            <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight">
              {t('title')}
            </h1>
          </div>
        </div>
      </div>

      {/* Sticky Search Input */}
      <div className="sticky top-[72px] z-[9] px-4 py-2 bg-background/80 backdrop-blur-md -mx-px mb-4">
        <div className="max-w-2xl mx-auto">
          <SearchInput
            placeholder={t('searchPlaceholder')}
            onSearch={handleSearch}
            showAutocomplete={false}
          />
        </div>
      </div>

      {/* Featured Clinics Section */}
      <section className="pt-4">
        <div className="flex items-center justify-between px-4 pb-3">
          <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em]">
            {t('featuredClinics')}
          </h2>
          <Link
            href="/clinics"
            className="text-[#D90429] text-base font-semibold hover:underline"
          >
            {tCommon('seeAll')}
          </Link>
        </div>

        {/* Horizontal scrollable container with snap scrolling */}
        <div className="flex w-full overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 scrollbar-hide">
          {featuredClinics.map((clinic) => (
            <div key={clinic.id} className="flex-shrink-0 w-[40%] snap-start">
              <ClinicCard
                clinic={clinic}
                onClick={() => handleClinicClick(clinic.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Popular Procedures Section */}
      <section className="px-4 pb-24 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em]">
            {t('popularProcedures')}
          </h2>
          <Link
            href="/treatments"
            className="text-[#D90429] text-base font-semibold hover:underline"
          >
            {tCommon('seeAll')}
          </Link>
        </div>

        {/* 2-column grid matching HTML design */}
        <div className="grid grid-cols-2 gap-4">
          {popularProcedures.map((treatment, index) => (
            <TreatmentCard
              key={treatment.id}
              treatment={treatment}
              onClick={() => handleTreatmentClick(treatment.id)}
              highlighted={index === 0}
            />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
