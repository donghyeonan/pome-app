import { NextRequest, NextResponse } from 'next/server';
import {
  getSavedItemsWithDetails,
  createSavedItem,
} from '@/lib/db/queries';
import { createSavedItemSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error';
import { requireAuthAPI } from '@/lib/api-auth';

export async function GET() {
  try {
    // Require authentication
    const auth = await requireAuthAPI();
    if (auth instanceof NextResponse) return auth;

    const { userId } = auth;

    // Use query function
    const savedItems = await getSavedItemsWithDetails(userId);

    return Response.json({ savedItems });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuthAPI();
    if (auth instanceof NextResponse) return auth;

    const { userId } = auth;

    const body = await request.json();
    const data = createSavedItemSchema.parse(body);

    // Use query function
    const savedItem = await createSavedItem({
      userId,
      itemType: data.itemType,
      itemId: data.itemId,
      notes: data.notes,
    });

    return Response.json({ savedItem }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
