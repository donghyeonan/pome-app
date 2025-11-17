import { TreatmentCardSkeleton } from '@/components/cards/treatment-card-skeleton';
import { ClinicCardSkeleton } from '@/components/cards/clinic-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Search bar skeleton */}
        <div className="mb-6">
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>

        {/* Results count skeleton */}
        <Skeleton className="mb-6 h-6 w-48" />

        {/* Treatments section skeleton */}
        <div className="mb-8">
          <Skeleton className="mb-4 h-7 w-32" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <TreatmentCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Clinics section skeleton */}
        <div>
          <Skeleton className="mb-4 h-7 w-32" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ClinicCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
