'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface TreatmentFiltersSidebarProps {
  allCategories: string[];
  selectedCategories: string[];
  priceRange: [number, number];
  onCategoryToggle: (category: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function TreatmentFiltersSidebar({
  allCategories,
  selectedCategories,
  priceRange,
  onCategoryToggle,
  onPriceRangeChange,
  onClearFilters,
  hasActiveFilters,
}: TreatmentFiltersSidebarProps) {
  const t = useTranslations('treatments');
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-4 sticky top-24">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{tCommon('filter')}</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-8 text-xs"
              >
                {tCommon('clear')}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Categories Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">{t('filterByCategory')}</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {allCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => onCategoryToggle(category)}
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
            <h3 className="font-semibold mb-3 text-sm">{t('filterByPrice')}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">
                  Min: ₩{(priceRange[0] / 1000).toFixed(0)}K
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={priceRange[0]}
                  onChange={(e) =>
                    onPriceRangeChange([parseInt(e.target.value), priceRange[1]])
                  }
                  className="w-full accent-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Max: ₩{(priceRange[1] / 1000).toFixed(0)}K
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    onPriceRangeChange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
