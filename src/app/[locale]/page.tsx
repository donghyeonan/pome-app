import { getTranslations } from 'next-intl/server';
import { PageLayout } from '@/components/layout/page-layout';
import { getFeaturedClinics, getFeaturedTreatments } from '@/lib/db/queries';
import { HomeContent } from '@/components/home/home-content';

export default async function Home() {
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');

  // Fetch data from database
  const [featuredClinics, popularTreatments] = await Promise.all([
    getFeaturedClinics(5),
    getFeaturedTreatments(8),
  ]);

  return (
    <PageLayout>
      <HomeContent
        featuredClinics={featuredClinics}
        popularTreatments={popularTreatments}
        translations={{
          title: t('title'),
          searchPlaceholder: t('searchPlaceholder'),
          featuredClinics: t('featuredClinics'),
          popularProcedures: t('popularProcedures'),
          seeAll: tCommon('seeAll'),
        }}
      />
    </PageLayout>
  );
}
