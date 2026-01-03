'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'name';

export interface TreatmentFiltersState {
  categories: string[];
  priceMin: number;
  priceMax: number;
  search: string;
  sort: SortOption;
}

export interface UseTreatmentFiltersReturn {
  filters: TreatmentFiltersState;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  updateFilters: (updates: Partial<TreatmentFiltersState>) => void;
  toggleCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSearch: (query: string) => void;
  setSort: (sort: SortOption) => void;
  clearFilters: () => void;
}

const DEFAULT_PRICE_MAX = 10000000;

export function useTreatmentFilters(): UseTreatmentFiltersReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current filters from URL
  const filters = useMemo<TreatmentFiltersState>(() => ({
    categories: searchParams.get('categories')?.split(',').filter(Boolean) ?? [],
    priceMin: Number(searchParams.get('priceMin')) || 0,
    priceMax: Number(searchParams.get('priceMax')) || DEFAULT_PRICE_MAX,
    search: searchParams.get('search') || '',
    sort: (searchParams.get('sort') as SortOption) || 'popularity',
  }), [searchParams]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => (
    filters.categories.length > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax < DEFAULT_PRICE_MAX ||
    filters.search !== ''
  ), [filters]);

  const activeFilterCount = useMemo(() => (
    filters.categories.length +
    (filters.priceMin > 0 ? 1 : 0) +
    (filters.priceMax < DEFAULT_PRICE_MAX ? 1 : 0) +
    (filters.search ? 1 : 0)
  ), [filters]);

  // Update URL with new params
  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === '' ||
          value === '0' ||
          value === DEFAULT_PRICE_MAX.toString() ||
          value === 'popularity'
        ) {
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
    (updates: Partial<TreatmentFiltersState>) => {
      const urlUpdates: Record<string, string | null> = {};

      if ('categories' in updates) {
        urlUpdates.categories = updates.categories?.length
          ? updates.categories.join(',')
          : null;
      }
      if ('priceMin' in updates) {
        urlUpdates.priceMin = updates.priceMin ? updates.priceMin.toString() : null;
      }
      if ('priceMax' in updates) {
        urlUpdates.priceMax = updates.priceMax !== DEFAULT_PRICE_MAX
          ? updates.priceMax?.toString() ?? null
          : null;
      }
      if ('search' in updates) {
        urlUpdates.search = updates.search || null;
      }
      if ('sort' in updates) {
        urlUpdates.sort = updates.sort !== 'popularity' ? updates.sort ?? null : null;
      }

      updateUrl(urlUpdates);
    },
    [updateUrl]
  );

  // Toggle a single category
  const toggleCategory = useCallback(
    (category: string) => {
      const newCategories = filters.categories.includes(category)
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category];
      updateFilters({ categories: newCategories });
    },
    [filters.categories, updateFilters]
  );

  // Set price range
  const setPriceRange = useCallback(
    (range: [number, number]) => {
      updateFilters({ priceMin: range[0], priceMax: range[1] });
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
    toggleCategory,
    setPriceRange,
    setSearch,
    setSort,
    clearFilters,
  };
}
