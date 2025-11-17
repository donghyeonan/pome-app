import { useTranslations } from 'next-intl';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { PageLayout } from '@/components/layout/page-layout';
import { SearchResultsContent } from '@/components/search/search-results-content';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const t = useTranslations('search');
  const query = searchParams.q || '';

  return (
    <ProtectedRoute>
      <PageLayout title={t('title')}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          {t('title')}
        </h1>
        <SearchResultsContent query={query} />
      </PageLayout>
    </ProtectedRoute>
  );
}
