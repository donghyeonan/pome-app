import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchQuerySchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { q, limit } = searchQuerySchema.parse(Object.fromEntries(searchParams));

    // Search treatments and clinics in parallel
    const [treatments, clinics] = await Promise.all([
      prisma.treatment.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: limit,
      }),
      prisma.clinic.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: limit,
      }),
    ]);

    return Response.json({
      treatments,
      clinics,
      query: q,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
