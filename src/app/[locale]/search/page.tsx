import { useTranslations } from 'next-intl';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SearchResultsContent } from '@/components/search/search-results-content';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const t = useTranslations('search');
  const query = searchParams.q || '';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
          <SearchResultsContent query={query} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
