import { getTreatments } from '@/lib/db/queries/treatments';
import TreatmentsClient from './TreatmentsClient';

interface PageProps {
  searchParams: Promise<{
    categories?: string;
    priceMin?: string;
    priceMax?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function TreatmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Parse filters from URL
  const filters = {
    categories: params.categories?.split(',').filter(Boolean),
    priceMin: params.priceMin ? Number(params.priceMin) : undefined,
    priceMax: params.priceMax ? Number(params.priceMax) : undefined,
    search: params.search,
  };

  // Fetch treatments from database
  const result = await getTreatments(filters, { limit: 100 });

  // Extract unique categories from all treatments for filter options
  const categorySet = new Set<string>();
  result.treatments.forEach((treatment) => {
    treatment.categories.forEach((cat) => categorySet.add(cat));
  });
  const allCategories = Array.from(categorySet).sort();

  return (
    <TreatmentsClient
      treatments={result.treatments}
      allCategories={allCategories}
      totalCount={result.pagination.total}
    />
  );
}
