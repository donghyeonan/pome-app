'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';
import { SearchInput } from '@/components/search/search-input';
import { ClinicCard } from '@/components/cards/clinic-card';
import { ClinicFiltersSidebar } from '@/components/filters/clinic-filters-sidebar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Clinic } from '@prisma/client';

type SortOption = 'rating' | 'name' | 'location';

interface ClinicsClientProps {
  clinics: Clinic[];
  allLocations: string[];
  allSpecialties: string[];
  totalCount: number;
}

export default function ClinicsClient({
  clinics,
  allLocations,
  allSpecialties,
  totalCount,
}: ClinicsClientProps) {
  const t = useTranslations('clinics');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read filter state from URL
  const selectedLocations = searchParams.get('locations')?.split(',').filter(Boolean) ?? [];
  const selectedSpecialties = searchParams.get('specialties')?.split(',').filter(Boolean) ?? [];
  const verifiedOnly = searchParams.get('verified') === 'true';
  const selectedPriceLevel = searchParams.get('priceLevel')?.split(',').map(Number).filter(Boolean) ?? [];
  const sortBy = (searchParams.get('sort') as SortOption) || 'rating';
  const searchQuery = searchParams.get('search') || '';

  // Update URL with new params
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'false') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : '', { scroll: false });
    },
    [router, searchParams]
  );

  // Filter and sort clinics client-side
  const filteredClinics = clinics
    .filter((clinic) => {
      if (selectedLocations.length > 0) {
        if (!clinic.location || !selectedLocations.includes(clinic.location)) {
          return false;
        }
      }
      if (selectedPriceLevel.length > 0) {
        if (!clinic.priceLevel || !selectedPriceLevel.includes(clinic.priceLevel)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating ?? 0) - (a.rating ?? 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'location':
          return (a.location ?? '').localeCompare(b.location ?? '');
        default:
          return 0;
      }
    });

  const handleSearch = (query: string) => {
    updateParams({ search: query || null });
  };

  const handleClinicClick = (clinicId: string) => {
    router.push(`/clinics/${clinicId}`);
  };

  const toggleLocation = (location: string) => {
    const newLocations = selectedLocations.includes(location)
      ? selectedLocations.filter((l) => l !== location)
      : [...selectedLocations, location];
    updateParams({ locations: newLocations.length > 0 ? newLocations.join(',') : null });
  };

  const toggleSpecialty = (specialty: string) => {
    const newSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter((s) => s !== specialty)
      : [...selectedSpecialties, specialty];
    updateParams({ specialties: newSpecialties.length > 0 ? newSpecialties.join(',') : null });
  };

  const togglePriceLevel = (level: number) => {
    const newLevels = selectedPriceLevel.includes(level)
      ? selectedPriceLevel.filter((l) => l !== level)
      : [...selectedPriceLevel, level];
    updateParams({ priceLevel: newLevels.length > 0 ? newLevels.join(',') : null });
  };

  const handleVerifiedToggle = (checked: boolean) => {
    updateParams({ verified: checked ? 'true' : null });
  };

  const handleSortChange = (value: string) => {
    updateParams({ sort: value !== 'rating' ? value : null });
  };

  const clearFilters = () => {
    router.push('', { scroll: false });
  };

  const hasActiveFilters =
    selectedLocations.length > 0 ||
    selectedSpecialties.length > 0 ||
    verifiedOnly ||
    selectedPriceLevel.length > 0 ||
    searchQuery !== '';

  const activeFilterCount =
    selectedLocations.length +
    selectedSpecialties.length +
    (verifiedOnly ? 1 : 0) +
    selectedPriceLevel.length;

  return (
    <PageLayout title={t('title')}>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
          {t('allClinics')}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {filteredClinics.length} {t('title').toLowerCase()}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        {/* Search Input */}
        <SearchInput
          placeholder={t('searchClinics')}
          onSearch={handleSearch}
          defaultValue={searchQuery}
          showAutocomplete={false}
        />

        {/* Filter and Sort Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none min-h-[44px] touch-manipulation"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="ml-2">{tCommon('filter')}</span>
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {activeFilterCount || '•'}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>{tCommon('filter')}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Location Filter */}
                <div>
                  <h3 className="font-semibold mb-3">{t('filterByLocation')}</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {allLocations.map((location) => (
                      <label
                        key={location}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(location)}
                          onChange={() => toggleLocation(location)}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Specialty Filter */}
                <div>
                  <h3 className="font-semibold mb-3">{t('filterBySpecialty')}</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {allSpecialties.map((specialty) => (
                      <label
                        key={specialty}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSpecialties.includes(specialty)}
                          onChange={() => toggleSpecialty(specialty)}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Verified Filter */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => handleVerifiedToggle(e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm font-semibold">
                      {t('filterByVerified')}
                    </span>
                  </label>
                </div>

                {/* Price Level Filter */}
                <div>
                  <h3 className="font-semibold mb-3">{t('filterByPriceLevel')}</h3>
                  <div className="space-y-2">
                    {[1, 2, 3].map((level) => (
                      <label
                        key={level}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPriceLevel.includes(level)}
                          onChange={() => togglePriceLevel(level)}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{t(`priceLevel.${level}`)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    {tCommon('clear')} {tCommon('filter')}
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="flex-1 sm:w-[180px] min-h-[44px] touch-manipulation">
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">{t('sortByRating')}</SelectItem>
              <SelectItem value="name">{t('sortByName')}</SelectItem>
              <SelectItem value="location">{t('sortByLocation')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Layout with Sidebar */}
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6 xl:gap-8">
        {/* Desktop Sidebar - Hidden on mobile/tablet */}
        <aside className="hidden lg:block">
          <ClinicFiltersSidebar
            allLocations={allLocations}
            allSpecialties={allSpecialties}
            selectedLocations={selectedLocations}
            selectedSpecialties={selectedSpecialties}
            verifiedOnly={verifiedOnly}
            selectedPriceLevel={selectedPriceLevel}
            onLocationToggle={toggleLocation}
            onSpecialtyToggle={toggleSpecialty}
            onVerifiedToggle={handleVerifiedToggle}
            onPriceLevelToggle={togglePriceLevel}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </aside>

        {/* Clinics Grid */}
        <div>
          {filteredClinics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {filteredClinics.map((clinic) => (
                <ClinicCard
                  key={clinic.id}
                  clinic={clinic}
                  onClick={() => handleClinicClick(clinic.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium mb-2">{t('noClinics')}</p>
              <p className="text-muted-foreground mb-4">{tCommon('tryAgain')}</p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  {tCommon('clear')} {tCommon('filter')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
