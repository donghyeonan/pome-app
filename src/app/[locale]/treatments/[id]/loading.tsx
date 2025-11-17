import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function TreatmentDetailLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Description skeleton */}
        <Card className="mb-6 p-6">
          <Skeleton className="mb-4 h-6 w-32" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </Card>

        {/* Details skeleton */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="mb-2 h-5 w-24" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>

        {/* Clinics section skeleton */}
        <div>
          <Skeleton className="mb-4 h-7 w-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
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
