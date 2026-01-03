import { NextRequest } from 'next/server';
import { getClinicWithTreatments } from '@/lib/db/queries';
import { clinicIdSchema } from '@/lib/validations';
import { handleApiError, ApiError } from '@/lib/api-error';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = clinicIdSchema.parse(await params);

    const clinic = await getClinicWithTreatments(id);

    if (!clinic) {
      throw new ApiError(404, 'Clinic not found');
    }

    return Response.json({ clinic });
  } catch (error) {
    return handleApiError(error);
  }
}
