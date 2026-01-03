'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type SortOption = 'rating' | 'name' | 'location';

export interface ClinicFiltersState {
  locations: string[];
  specialties: string[];
  verified: boolean;
  priceLevel: number[];
  search: string;
  sort: SortOption;
}

export interface UseClinicFiltersReturn {
  filters: ClinicFiltersState;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  updateFilters: (updates: Partial<ClinicFiltersState>) => void;
  toggleLocation: (location: string) => void;
  toggleSpecialty: (specialty: string) => void;
  togglePriceLevel: (level: number) => void;
  setVerified: (verified: boolean) => void;
  setSearch: (query: string) => void;
  setSort: (sort: SortOption) => void;
  clearFilters: () => void;
}

export function useClinicFilters(): UseClinicFiltersReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current filters from URL
  const filters = useMemo<ClinicFiltersState>(() => ({
    locations: searchParams.get('locations')?.split(',').filter(Boolean) ?? [],
    specialties: searchParams.get('specialties')?.split(',').filter(Boolean) ?? [],
    verified: searchParams.get('verified') === 'true',
    priceLevel: searchParams.get('priceLevel')?.split(',').map(Number).filter(Boolean) ?? [],
    search: searchParams.get('search') || '',
    sort: (searchParams.get('sort') as SortOption) || 'rating',
  }), [searchParams]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => (
    filters.locations.length > 0 ||
    filters.specialties.length > 0 ||
    filters.verified ||
    filters.priceLevel.length > 0 ||
    filters.search !== ''
  ), [filters]);

  const activeFilterCount = useMemo(() => (
    filters.locations.length +
    filters.specialties.length +
    (filters.verified ? 1 : 0) +
    filters.priceLevel.length +
    (filters.search ? 1 : 0)
  ), [filters]);

  // Update URL with new params
  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'false' || value === 'rating') {
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

  // Update multiple filters at once
  const updateFilters = useCallback(
    (updates: Partial<ClinicFiltersState>) => {
      const urlUpdates: Record<string, string | null> = {};

      if ('locations' in updates) {
        urlUpdates.locations = updates.locations?.length
          ? updates.locations.join(',')
          : null;
      }
      if ('specialties' in updates) {
        urlUpdates.specialties = updates.specialties?.length
          ? updates.specialties.join(',')
          : null;
      }
      if ('verified' in updates) {
        urlUpdates.verified = updates.verified ? 'true' : null;
      }
      if ('priceLevel' in updates) {
        urlUpdates.priceLevel = updates.priceLevel?.length
          ? updates.priceLevel.join(',')
          : null;
      }
      if ('search' in updates) {
        urlUpdates.search = updates.search || null;
      }
      if ('sort' in updates) {
        urlUpdates.sort = updates.sort !== 'rating' ? updates.sort ?? null : null;
      }

      updateUrl(urlUpdates);
    },
    [updateUrl]
  );

  // Toggle a single location
  const toggleLocation = useCallback(
    (location: string) => {
      const newLocations = filters.locations.includes(location)
        ? filters.locations.filter((l) => l !== location)
        : [...filters.locations, location];
      updateFilters({ locations: newLocations });
    },
    [filters.locations, updateFilters]
  );

  // Toggle a single specialty
  const toggleSpecialty = useCallback(
    (specialty: string) => {
      const newSpecialties = filters.specialties.includes(specialty)
        ? filters.specialties.filter((s) => s !== specialty)
        : [...filters.specialties, specialty];
      updateFilters({ specialties: newSpecialties });
    },
    [filters.specialties, updateFilters]
  );

  // Toggle a price level
  const togglePriceLevel = useCallback(
    (level: number) => {
      const newLevels = filters.priceLevel.includes(level)
        ? filters.priceLevel.filter((l) => l !== level)
        : [...filters.priceLevel, level];
      updateFilters({ priceLevel: newLevels });
    },
    [filters.priceLevel, updateFilters]
  );

  // Set verified filter
  const setVerified = useCallback(
    (verified: boolean) => {
      updateFilters({ verified });
    },
    [updateFilters]
  );

  // Set search query
  const setSearch = useCallback(
    (query: string) => {
      updateFilters({ search: query });
    },
    [updateFilters]
  );

  // Set sort option
  const setSort = useCallback(
    (sort: SortOption) => {
      updateFilters({ sort });
    },
    [updateFilters]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push('', { scroll: false });
  }, [router]);

  return {
    filters,
    hasActiveFilters,
    activeFilterCount,
    updateFilters,
    toggleLocation,
    toggleSpecialty,
    togglePriceLevel,
    setVerified,
    setSearch,
    setSort,
    clearFilters,
  };
}
