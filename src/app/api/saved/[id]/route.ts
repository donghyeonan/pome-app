import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    // First, verify the saved item belongs to the authenticated user
    const savedItem = await prisma.savedItem.findUnique({
      where: { id },
    });

    if (!savedItem) {
      throw new ApiError(404, 'Saved item not found');
    }

    if (savedItem.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden. You can only delete your own saved items.' },
        { status: 403 }
      );
    }

    // Delete saved item (user owns it)
    await prisma.savedItem.delete({
      where: { id },
    });

    return Response.json({ message: 'Saved item deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
