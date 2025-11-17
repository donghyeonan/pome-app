'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { PageLayout } from '@/components/layout/page-layout';
import { SearchInput } from '@/components/search/search-input';
import { TreatmentCard } from '@/components/cards/treatment-card';
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
import { treatments } from '@/data/treatments';
import { Treatment } from '@/types';

type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'name';

export default function TreatmentsPage() {
  const t = useTranslations('treatments');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract all unique categories from treatments
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    treatments.forEach((treatment) => {
      treatment.categories.forEach((category) => categorySet.add(category));
    });
    return Array.from(categorySet).sort();
  }, []);

  // Filter and sort treatments
  const filteredTreatments = useMemo(() => {
    let filtered = treatments;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (treatment) =>
          treatment.name.toLowerCase().includes(query) ||
          treatment.description.toLowerCase().includes(query) ||
          treatment.categories.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((treatment) =>
        treatment.categories.some((cat) => selectedCategories.includes(cat))
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (treatment) =>
        treatment.priceRange.min >= priceRange[0] &&
        treatment.priceRange.max <= priceRange[1]
    );

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'popularity':
        // Keep original order (assumed to be by popularity)
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.priceRange.min - b.priceRange.min);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.priceRange.max - a.priceRange.max);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return sorted;
  }, [searchQuery, selectedCategories, priceRange, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTreatmentClick = (treatmentId: string) => {
    router.push(`/treatments/${treatmentId}`);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000000]);
  };

  const hasActiveFilters = selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000000;

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
          <h1 className="text-3xl font-bold mb-2">{t('allTreatments')}</h1>
          <p className="text-muted-foreground">
            {filteredTreatments.length} {t('title').toLowerCase()}
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-6 space-y-4">
          {/* Search Input */}
          <SearchInput
            placeholder={t('searchTreatments')}
            onSearch={handleSearch}
            showAutocomplete={true}
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
                      {selectedCategories.length}
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
                            className="rounded border-gray-300"
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
                            setPriceRange([parseInt(e.target.value), priceRange[1]])
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
                            setPriceRange([priceRange[0], parseInt(e.target.value)])
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
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="flex-1 sm:w-[180px]">
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

        {/* Treatments Grid */}
        {filteredTreatments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTreatments.map((treatment) => (
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
      </PageLayout>
    </ProtectedRoute>
  );
}
