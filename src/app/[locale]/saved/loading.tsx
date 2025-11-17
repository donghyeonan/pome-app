import { Skeleton } from '@/components/ui/skeleton';
import { TreatmentCardSkeleton } from '@/components/cards/treatment-card-skeleton';
import { ClinicCardSkeleton } from '@/components/cards/clinic-card-skeleton';

export default function SavedLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Title skeleton */}
        <Skeleton className="mb-6 h-8 w-48" />

        {/* Tabs skeleton */}
        <div className="mb-6 flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) =>
            i % 2 === 0 ? (
              <TreatmentCardSkeleton key={i} />
            ) : (
              <ClinicCardSkeleton key={i} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
