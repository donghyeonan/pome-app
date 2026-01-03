import { NextRequest, NextResponse } from 'next/server';
import { getSavedItemById, deleteSavedItem } from '@/lib/db/queries';
import { savedItemIdSchema } from '@/lib/validations';
import { handleApiError, ApiError } from '@/lib/api-error';
import { requireAuthAPI } from '@/lib/api-auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const auth = await requireAuthAPI();
    if (auth instanceof NextResponse) return auth;

    const { userId } = auth;

    const { id } = savedItemIdSchema.parse(await params);

    // Use query function to get item
    const savedItem = await getSavedItemById(id);

    if (!savedItem) {
      throw new ApiError(404, 'Saved item not found');
    }

    if (savedItem.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden. You can only delete your own saved items.' },
        { status: 403 }
      );
    }

    // Use query function to delete
    await deleteSavedItem(id);

    return Response.json({ message: 'Saved item deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
