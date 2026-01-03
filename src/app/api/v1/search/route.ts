import { NextRequest } from 'next/server';
import { search } from '@/lib/db/queries';
import { searchQuerySchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { q, limit } = searchQuerySchema.parse(
      Object.fromEntries(searchParams)
    );

    // Additional options
    const type = searchParams.get('type');
    const treatmentsOnly = type === 'treatments';
    const clinicsOnly = type === 'clinics';

    const result = await search(q, {
      limit,
      treatmentsOnly,
      clinicsOnly,
    });

    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
