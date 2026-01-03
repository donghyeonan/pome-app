import { NextRequest } from 'next/server';
import { getTreatments, type TreatmentFilters } from '@/lib/db/queries';
import { treatmentQuerySchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error';
import type { NavGroupKey } from '@/config/nav-groups';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = treatmentQuerySchema.parse(Object.fromEntries(searchParams));

    // Build filters from query params
    const filters: TreatmentFilters = {};

    if (query.categories) {
      filters.categories = query.categories.split(',');
    }
    if (query.priceMin !== undefined) {
      filters.priceMin = query.priceMin;
    }
    if (query.priceMax !== undefined) {
      filters.priceMax = query.priceMax;
    }

    // New taxonomy filters
    const navGroup = searchParams.get('navGroup');
    if (navGroup) {
      filters.navGroup = navGroup as NavGroupKey;
    }

    const goalTags = searchParams.get('goalTags');
    if (goalTags) {
      filters.goalTags = goalTags.split(',');
    }

    const modalityTags = searchParams.get('modalityTags');
    if (modalityTags) {
      filters.modalityTags = modalityTags.split(',');
    }

    const areaTags = searchParams.get('areaTags');
    if (areaTags) {
      filters.areaTags = areaTags.split(',');
    }

    const search = searchParams.get('search');
    if (search) {
      filters.search = search;
    }

    // Use query function
    const result = await getTreatments(filters, {
      page: query.page,
      limit: query.limit,
    });

    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
