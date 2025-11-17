import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function ClinicDetailLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Image gallery skeleton */}
        <Skeleton className="mb-6 h-64 w-full rounded-2xl" />

        {/* Header skeleton */}
        <div className="mb-6">
          <div className="mb-2 flex items-start justify-between">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="mb-3 h-5 w-1/2" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        {/* Description skeleton */}
        <Card className="mb-6 p-6">
          <Skeleton className="mb-4 h-6 w-24" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </Card>

        {/* Details grid skeleton */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="mb-2 h-5 w-32" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>

        {/* Treatments section skeleton */}
        <div>
          <Skeleton className="mb-4 h-7 w-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
