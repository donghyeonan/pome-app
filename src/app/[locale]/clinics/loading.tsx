import { ClinicCardSkeleton } from '@/components/cards/clinic-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClinicsLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Search bar skeleton */}
        <div className="mb-6">
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>

        {/* Filter and sort skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Clinic cards grid skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ClinicCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
