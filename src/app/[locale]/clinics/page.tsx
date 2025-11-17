'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { PageLayout } from '@/components/layout/page-layout';
import { SearchInput } from '@/components/search/search-input';
import { ClinicCard } from '@/components/cards/clinic-card';
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
import { clinics } from '@/data/clinics';

type SortOption = 'rating' | 'name' | 'location';

export default function ClinicsPage() {
  const t = useTranslations('clinics');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract all unique locations and specialties
  const allLocations = useMemo(() => {
    const locationSet = new Set<string>();
    clinics.forEach((clinic) => {
      locationSet.add(clinic.location);
    });
    return Array.from(locationSet).sort();
  }, []);

  const allSpecialties = useMemo(() => {
    const specialtySet = new Set<string>();
    clinics.forEach((clinic) => {
      clinic.specialties.forEach((specialty) => specialtySet.add(specialty));
    });
    return Array.from(specialtySet).sort();
  }, []);

  // Filter and sort clinics
  const filteredClinics = useMemo(() => {
    let filtered = clinics;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(query) ||
          clinic.description.toLowerCase().includes(query) ||
          clinic.location.toLowerCase().includes(query) ||
          clinic.specialties.some((spec) => spec.toLowerCase().includes(query))
      );
    }

    // Apply location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((clinic) =>
        selectedLocations.includes(clinic.location)
      );
    }

    // Apply specialty filter
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter((clinic) =>
        clinic.specialties.some((spec) => selectedSpecialties.includes(spec))
      );
    }

    // Apply verified filter
    if (verifiedOnly) {
      filtered = filtered.filter((clinic) => clinic.verified);
    }

    // Apply price level filter
    if (selectedPriceLevel.length > 0) {
      filtered = filtered.filter(
        (clinic) =>
          clinic.priceLevel && selectedPriceLevel.includes(clinic.priceLevel)
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'location':
        sorted.sort((a, b) => a.location.localeCompare(b.location));
        break;
    }

    return sorted;
  }, [
    searchQuery,
    selectedLocations,
    selectedSpecialties,
    verifiedOnly,
    selectedPriceLevel,
    sortBy,
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClinicClick = (clinicId: string) => {
    router.push(`/clinics/${clinicId}`);
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const togglePriceLevel = (level: number) => {
    setSelectedPriceLevel((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const clearFilters = () => {
    setSelectedLocations([]);
    setSelectedSpecialties([]);
    setVerifiedOnly(false);
    setSelectedPriceLevel([]);
  };

  const hasActiveFilters =
    selectedLocations.length > 0 ||
    selectedSpecialties.length > 0 ||
    verifiedOnly ||
    selectedPriceLevel.length > 0;

  const activeFilterCount =
    selectedLocations.length +
    selectedSpecialties.length +
    (verifiedOnly ? 1 : 0) +
    selectedPriceLevel.length;

  return (
    <ProtectedRoute
      fallback={
        <PageLayout>
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-muted-foreground">{tCommon('loading')}</p>
          </div>
        </PageLayout>
      }
    >
      <PageLayout title={t('title')}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{t('allClinics')}</h1>
          <p className="text-muted-foreground">
            {filteredClinics.length} {t('title').toLowerCase()}
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-6 space-y-4">
          {/* Search Input */}
          <SearchInput
            placeholder={t('searchClinics')}
            onSearch={handleSearch}
            showAutocomplete={false}
          />

          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <SlidersHorizontal className="h-4 w-4" />
                  {tCommon('filter')}
                  {hasActiveFilters && (
                    <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {activeFilterCount}
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
                    <h3 className="font-semibold mb-3">
                      {t('filterByLocation')}
                    </h3>
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
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Specialty Filter */}
                  <div>
                    <h3 className="font-semibold mb-3">
                      {t('filterBySpecialty')}
                    </h3>
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
                            className="rounded border-gray-300"
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
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm font-semibold">
                        {t('filterByVerified')}
                      </span>
                    </label>
                  </div>

                  {/* Price Level Filter */}
                  <div>
                    <h3 className="font-semibold mb-3">
                      {t('filterByPriceLevel')}
                    </h3>
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
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">
                            {t(`priceLevel.${level}`)}
                          </span>
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
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="flex-1 sm:w-[180px]">
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

        {/* Clinics Grid */}
        {filteredClinics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </PageLayout>
    </ProtectedRoute>
  );
}
