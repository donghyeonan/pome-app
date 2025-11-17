import { NextRequest, NextResponse } from 'next/server';

/**
 * DELETE /api/saved/[id]
 * 
 * Removes a saved item for the authenticated user.
 * 
 * Path Parameters:
 * - id: SavedItem ID
 * 
 * Response:
 * {
 *   success: boolean,
 *   message: string
 * }
 * 
 * Phase 2 Implementation:
 * - Require authentication
 * - Verify user owns the saved item
 * - Delete from database
 * - Return success response
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // TODO: Phase 3 - Add authentication check
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json(
  //     { error: 'Unauthorized' },
  //     { status: 401 }
  //   );
  // }

  // TODO: Phase 2 - Implement with Prisma
  // const savedItem = await prisma.savedItem.findUnique({
  //   where: { id: params.id },
  // });

  // if (!savedItem) {
  //   return NextResponse.json(
  //     { error: 'Saved item not found' },
  //     { status: 404 }
  //   );
  // }

  // // Verify ownership
  // if (savedItem.userId !== session.user.id) {
  //   return NextResponse.json(
  //     { error: 'Forbidden' },
  //     { status: 403 }
  //   );
  // }

  // await prisma.savedItem.delete({
  //   where: { id: params.id },
  // });

  // return NextResponse.json({
  //   success: true,
  //   message: 'Saved item removed successfully',
  // });

  return NextResponse.json(
    {
      error: 'Not implemented',
      message: 'This endpoint will be implemented in Phase 2/3 with database and authentication',
    },
    { status: 501 }
  );
}
