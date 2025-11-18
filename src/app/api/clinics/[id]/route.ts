import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clinicIdSchema } from '@/lib/validations';
import { handleApiError, ApiError } from '@/lib/api-error';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = clinicIdSchema.parse(await params);

    const clinic = await prisma.clinic.findUnique({
      where: { id },
      include: {
        treatments: {
          include: {
            treatment: true,
          },
        },
      },
    });

    if (!clinic) {
      throw new ApiError(404, 'Clinic not found');
    }

    // Transform to include treatment details with price and availability
    const treatments = clinic.treatments.map((ct) => ({
      ...ct.treatment,
      price: ct.price,
      availability: ct.availability,
    }));

    return Response.json({
      clinic: {
        ...clinic,
        treatments,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
