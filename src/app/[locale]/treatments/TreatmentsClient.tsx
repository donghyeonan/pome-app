'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';
import { SearchInput } from '@/components/search/search-input';
import { TreatmentCard } from '@/components/cards/treatment-card';
import { TreatmentFiltersSidebar } from '@/components/filters/treatment-filters-sidebar';
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
import type { Treatment } from '@prisma/client';

type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'name';

interface TreatmentsClientProps {
  treatments: Treatment[];
  allCategories: string[];
  totalCount: number;
}

export default function TreatmentsClient({
  treatments,
  allCategories,
  totalCount,
}: TreatmentsClientProps) {
  const t = useTranslations('treatments');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read filter state from URL
  const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) ?? [];
  const priceMin = Number(searchParams.get('priceMin')) || 0;
  const priceMax = Number(searchParams.get('priceMax')) || 10000000;
  const priceRange: [number, number] = [priceMin, priceMax];
  const sortBy = (searchParams.get('sort') as SortOption) || 'popularity';
  const searchQuery = searchParams.get('search') || '';

  // Update URL with new params
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === '0' || value === '10000000') {
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

  // Sort treatments client-side (server already filtered)
  const sortedTreatments = [...treatments].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (a.priceMin ?? 0) - (b.priceMin ?? 0);
      case 'price-desc':
        return (b.priceMax ?? 0) - (a.priceMax ?? 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleSearch = (query: string) => {
    updateParams({ search: query || null });
  };

  const handleTreatmentClick = (treatmentId: string) => {
    router.push(`/treatments/${treatmentId}`);
  };

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    updateParams({ categories: newCategories.length > 0 ? newCategories.join(',') : null });
  };

  const handlePriceRangeChange = (newRange: [number, number]) => {
    updateParams({
      priceMin: newRange[0] > 0 ? newRange[0].toString() : null,
      priceMax: newRange[1] < 10000000 ? newRange[1].toString() : null,
    });
  };

  const handleSortChange = (value: string) => {
    updateParams({ sort: value !== 'popularity' ? value : null });
  };

  const clearFilters = () => {
    router.push('', { scroll: false });
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceMin > 0 ||
    priceMax < 10000000 ||
    searchQuery !== '';

  return (
    <PageLayout title={t('title')}>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
          {t('allTreatments')}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {sortedTreatments.length} {t('title').toLowerCase()}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        {/* Search Input */}
        <SearchInput
          placeholder={t('searchTreatments')}
          onSearch={handleSearch}
          defaultValue={searchQuery}
          showAutocomplete={true}
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
                    {selectedCategories.length || '•'}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>{tCommon('filter')}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Categories Filter */}
                <div>
                  <h3 className="font-semibold mb-3">{t('filterByCategory')}</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {allCategories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="rounded border-border"
                        />
                        <span className="text-sm capitalize">
                          {category.replace(/-/g, ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-semibold mb-3">{t('filterByPrice')}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Min: ₩{(priceRange[0] / 1000).toFixed(0)}K
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="100000"
                        value={priceRange[0]}
                        onChange={(e) =>
                          handlePriceRangeChange([parseInt(e.target.value), priceRange[1]])
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Max: ₩{(priceRange[1] / 1000).toFixed(0)}K
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="100000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])
                        }
                        className="w-full"
                      />
                    </div>
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
              <SelectItem value="popularity">{t('sortByPopularity')}</SelectItem>
              <SelectItem value="price-asc">{t('sortByPrice')} (Low)</SelectItem>
              <SelectItem value="price-desc">{t('sortByPrice')} (High)</SelectItem>
              <SelectItem value="name">{t('sortByName')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Layout with Sidebar */}
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6 xl:gap-8">
        {/* Desktop Sidebar - Hidden on mobile/tablet */}
        <aside className="hidden lg:block">
          <TreatmentFiltersSidebar
            allCategories={allCategories}
            selectedCategories={selectedCategories}
            priceRange={priceRange}
            onCategoryToggle={toggleCategory}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </aside>

        {/* Treatments Grid */}
        <div>
          {sortedTreatments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {sortedTreatments.map((treatment) => (
                <TreatmentCard
                  key={treatment.id}
                  treatment={treatment}
                  onClick={() => handleTreatmentClick(treatment.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium mb-2">{t('noTreatments')}</p>
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
