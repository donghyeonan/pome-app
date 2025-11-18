import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { savedItemIdSchema } from '@/lib/validations';
import { handleApiError, ApiError } from '@/lib/api-error';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = savedItemIdSchema.parse(await params);

    // Delete saved item
    await prisma.savedItem.delete({
      where: { id },
    });

    return Response.json({ message: 'Saved item deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
