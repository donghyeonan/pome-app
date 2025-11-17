import { notFound } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { PageLayout } from '@/components/layout/page-layout';
import { ClinicDetailContent } from '@/components/clinics/clinic-detail-content';
import { clinics } from '@/data/clinics';
import { treatments } from '@/data/treatments';
import { clinicTreatments } from '@/data/clinic-treatments';

interface ClinicDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function ClinicDetailPage({
  params,
}: ClinicDetailPageProps) {
  const { id } = await params;

  // Find the clinic
  const clinic = clinics.find((c) => c.id === id);

  if (!clinic) {
    notFound();
  }

  // Get treatments offered by this clinic
  const treatmentIds = clinicTreatments
    .filter((ct) => ct.clinicId === id)
    .map((ct) => ct.treatmentId);

  const availableTreatments = treatments.filter((treatment) =>
    treatmentIds.includes(treatment.id)
  );

  // Get clinic treatment data for this clinic
  const relevantClinicTreatments = clinicTreatments.filter(
    (ct) => ct.clinicId === id
  );

  return (
    <ProtectedRoute>
      <PageLayout title={clinic.name}>
        <ClinicDetailContent
          clinic={clinic}
          availableTreatments={availableTreatments}
          clinicTreatmentData={relevantClinicTreatments}
        />
      </PageLayout>
    </ProtectedRoute>
  );
}
