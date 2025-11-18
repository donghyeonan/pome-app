import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { treatmentQuerySchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = treatmentQuerySchema.parse(Object.fromEntries(searchParams));

    // Build where clause for filters
    const where: Prisma.TreatmentWhereInput = {};

    if (query.categories) {
      where.categories = { hasSome: query.categories.split(',') };
    }

    if (query.priceMin !== undefined || query.priceMax !== undefined) {
      where.AND = [];
      if (query.priceMin !== undefined) {
        where.AND.push({ priceMin: { gte: query.priceMin } });
      }
      if (query.priceMax !== undefined) {
        where.AND.push({ priceMax: { lte: query.priceMax } });
      }
    }

    // Query treatments with pagination
    const [treatments, total] = await Promise.all([
      prisma.treatment.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { name: 'asc' },
      }),
      prisma.treatment.count({ where }),
    ]);

    return Response.json({
      treatments,
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
