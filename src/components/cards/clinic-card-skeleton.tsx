import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Clinic Card Skeleton Component
 * 
 * A loading placeholder that matches the structure and dimensions of the
 * ClinicCard component. Used to provide visual feedback during data loading.
 * 
 * @component
 * @example
 * ```tsx
 * // Show skeleton while loading
 * {isLoading ? (
 *   <ClinicCardSkeleton />
 * ) : (
 *   <ClinicCard clinic={clinic} />
 * )}
 * 
 * // Multiple skeletons in a grid
 * <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 *   {Array.from({ length: 6 }).map((_, i) => (
 *     <ClinicCardSkeleton key={i} />
 *   ))}
 * </div>
 * ```
 * 
 * Structure:
 * - Image placeholder (h-48)
 * - Title placeholder (3/4 width)
 * - Location placeholder (1/2 width)
 * - Rating and badge placeholders
 * 
 * @returns {JSX.Element} The skeleton loading component
 */
export function ClinicCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-3 h-4 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </Card>
  );
}
