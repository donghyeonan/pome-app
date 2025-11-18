import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { treatmentIdSchema } from '@/lib/validations';
import { handleApiError, ApiError } from '@/lib/api-error';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = treatmentIdSchema.parse(await params);

    const treatment = await prisma.treatment.findUnique({
      where: { id },
    });

    if (!treatment) {
      throw new ApiError(404, 'Treatment not found');
    }

    return Response.json({ treatment });
  } catch (error) {
    return handleApiError(error);
  }
}
