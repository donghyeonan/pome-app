import { getClinics } from '@/lib/db/queries/clinics';
import ClinicsClient from './ClinicsClient';

interface PageProps {
  searchParams: Promise<{
    locations?: string;
    specialties?: string;
    verified?: string;
    priceLevel?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function ClinicsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Parse filters from URL
  const filters = {
    specialties: params.specialties?.split(',').filter(Boolean),
    verified: params.verified === 'true' ? true : undefined,
    search: params.search,
  };

  // Fetch clinics from database
  const result = await getClinics(filters, { limit: 100 });

  // Extract unique locations and specialties for filter options
  const locationSet = new Set<string>();
  const specialtySet = new Set<string>();
  result.clinics.forEach((clinic) => {
    if (clinic.location) locationSet.add(clinic.location);
    clinic.specialties.forEach((spec) => specialtySet.add(spec));
  });
  const allLocations = Array.from(locationSet).sort();
  const allSpecialties = Array.from(specialtySet).sort();

  return (
    <ClinicsClient
      clinics={result.clinics}
      allLocations={allLocations}
      allSpecialties={allSpecialties}
      totalCount={result.pagination.total}
    />
  );
}
