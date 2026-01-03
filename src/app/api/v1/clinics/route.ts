import { NextRequest } from 'next/server';
import { getClinics, type ClinicFilters } from '@/lib/db/queries';
import { clinicQuerySchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = clinicQuerySchema.parse(Object.fromEntries(searchParams));

    // Build filters from query params
    const filters: ClinicFilters = {};

    if (query.location) {
      filters.location = query.location;
    }
    if (query.verified !== undefined) {
      filters.verified = query.verified;
    }
    if (query.specialties) {
      filters.specialties = query.specialties.split(',');
    }

    // Additional filters
    const priceLevel = searchParams.get('priceLevel');
    if (priceLevel) {
      filters.priceLevel = parseInt(priceLevel, 10);
    }

    const minRating = searchParams.get('minRating');
    if (minRating) {
      filters.minRating = parseFloat(minRating);
    }

    const search = searchParams.get('search');
    if (search) {
      filters.search = search;
    }

    // Use query function
    const result = await getClinics(filters, {
      page: query.page,
      limit: query.limit,
    });

    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
