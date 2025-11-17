'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ClinicFiltersSidebarProps {
  allLocations: string[];
  allSpecialties: string[];
  selectedLocations: string[];
  selectedSpecialties: string[];
  verifiedOnly: boolean;
  selectedPriceLevel: number[];
  onLocationToggle: (location: string) => void;
  onSpecialtyToggle: (specialty: string) => void;
  onVerifiedToggle: (checked: boolean) => void;
  onPriceLevelToggle: (level: number) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function ClinicFiltersSidebar({
  allLocations,
  allSpecialties,
  selectedLocations,
  selectedSpecialties,
  verifiedOnly,
  selectedPriceLevel,
  onLocationToggle,
  onSpecialtyToggle,
  onVerifiedToggle,
  onPriceLevelToggle,
  onClearFilters,
  hasActiveFilters,
}: ClinicFiltersSidebarProps) {
  const t = useTranslations('clinics');
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
          {/* Location Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">
              {t('filterByLocation')}
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {allLocations.map((location) => (
                <label
                  key={location}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                  <Checkbox
                    checked={selectedLocations.includes(location)}
                    onCheckedChange={() => onLocationToggle(location)}
                  />
                  <span className="text-sm">{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Specialty Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">
              {t('filterBySpecialty')}
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {allSpecialties.map((specialty) => (
                <label
                  key={specialty}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                  <Checkbox
                    checked={selectedSpecialties.includes(specialty)}
                    onCheckedChange={() => onSpecialtyToggle(specialty)}
                  />
                  <span className="text-sm">{specialty}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Verified Filter */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors">
              <Checkbox
                checked={verifiedOnly}
                onCheckedChange={onVerifiedToggle}
              />
              <span className="text-sm font-semibold">
                {t('filterByVerified')}
              </span>
            </label>
          </div>

          {/* Price Level Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">
              {t('filterByPriceLevel')}
            </h3>
            <div className="space-y-2">
              {[1, 2, 3].map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                  <Checkbox
                    checked={selectedPriceLevel.includes(level)}
                    onCheckedChange={() => onPriceLevelToggle(level)}
                  />
                  <span className="text-sm">{t(`priceLevel.${level}`)}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
