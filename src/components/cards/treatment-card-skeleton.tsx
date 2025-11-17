import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Treatment Card Skeleton Component
 * 
 * A loading placeholder that matches the structure and dimensions of the
 * TreatmentCard component. Used to provide visual feedback during data loading.
 * 
 * @component
 * @example
 * ```tsx
 * // Show skeleton while loading
 * {isLoading ? (
 *   <TreatmentCardSkeleton />
 * ) : (
 *   <TreatmentCard treatment={treatment} />
 * )}
 * 
 * // Multiple skeletons in a grid
 * <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 *   {Array.from({ length: 8 }).map((_, i) => (
 *     <TreatmentCardSkeleton key={i} />
 *   ))}
 * </div>
 * ```
 * 
 * Structure:
 * - Icon placeholder (circular, h-12 w-12)
 * - Price range placeholder
 * - Title placeholder (3/4 width)
 * - Description placeholders (2 lines)
 * 
 * @returns {JSX.Element} The skeleton loading component
 */
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
