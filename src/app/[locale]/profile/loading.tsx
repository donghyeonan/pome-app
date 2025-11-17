import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto max-w-2xl px-4 py-6">
        {/* Title skeleton */}
        <Skeleton className="mb-6 h-8 w-32" />

        {/* Profile card skeleton */}
        <Card className="mb-6 p-6">
          <div className="mb-6 flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </Card>

        {/* Logout button skeleton */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
