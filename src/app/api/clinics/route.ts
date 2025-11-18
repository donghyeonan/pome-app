import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clinicQuerySchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = clinicQuerySchema.parse(Object.fromEntries(searchParams));

    // Build where clause for filters
    const where: Prisma.ClinicWhereInput = {};

    if (query.location) {
      where.location = { contains: query.location, mode: 'insensitive' };
    }

    if (query.verified !== undefined) {
      where.verified = query.verified;
    }

    if (query.specialties) {
      where.specialties = { hasSome: query.specialties.split(',') };
    }

    // Query clinics with pagination
    const [clinics, total] = await Promise.all([
      prisma.clinic.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { name: 'asc' },
      }),
      prisma.clinic.count({ where }),
    ]);

    return Response.json({
      clinics,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
