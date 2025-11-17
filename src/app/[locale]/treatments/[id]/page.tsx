import { notFound } from 'next/navigation';
import { PageLayout } from '@/components/layout/page-layout';
import { TreatmentDetailContent } from '@/components/treatments/treatment-detail-content';
import { treatments } from '@/data/treatments';
import { clinics } from '@/data/clinics';
import { clinicTreatments } from '@/data/clinic-treatments';

interface TreatmentDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function TreatmentDetailPage({
  params,
}: TreatmentDetailPageProps) {
  const { id } = await params;

  // Find the treatment
  const treatment = treatments.find((t) => t.id === id);

  if (!treatment) {
    notFound();
  }

  // Get clinics offering this treatment
  const clinicIds = clinicTreatments
    .filter((ct) => ct.treatmentId === id)
    .map((ct) => ct.clinicId);

  const offeringClinics = clinics.filter((clinic) =>
    clinicIds.includes(clinic.id)
  );

  // Get clinic treatment data for this treatment
  const relevantClinicTreatments = clinicTreatments.filter(
    (ct) => ct.treatmentId === id
  );

  return (
    <PageLayout title={treatment.name}>
      <TreatmentDetailContent
        treatment={treatment}
        offeringClinics={offeringClinics}
        clinicTreatmentData={relevantClinicTreatments}
      />
    </PageLayout>
  );
}
