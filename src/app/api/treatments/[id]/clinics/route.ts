import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { treatmentIdSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = treatmentIdSchema.parse(await params);

    // Query clinics offering this treatment via ClinicTreatment junction
    const clinicTreatments = await prisma.clinicTreatment.findMany({
      where: { treatmentId: id },
      include: {
        clinic: true,
      },
    });

    // Transform to include price and availability
    const clinics = clinicTreatments.map((ct) => ({
      ...ct.clinic,
      price: ct.price,
      availability: ct.availability,
    }));

    return Response.json({ clinics });
  } catch (error) {
    return handleApiError(error);
  }
}
