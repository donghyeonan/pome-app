import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TreatmentCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-start justify-between">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="mb-2 h-6 w-3/4" />
      <Skeleton className="mb-3 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </Card>
  );
}
