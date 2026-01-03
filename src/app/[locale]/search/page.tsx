import { search } from '@/lib/db/queries/search';
import SearchClient from './SearchClient';

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || '';

  // Fetch search results from database
  const result = query
    ? await search(query, { limit: 20 })
    : { treatments: [], clinics: [], query: '' };

  return (
    <SearchClient
      treatments={result.treatments}
      clinics={result.clinics}
      query={query}
    />
  );
}
