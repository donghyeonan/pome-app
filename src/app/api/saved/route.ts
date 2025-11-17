import { NextRequest, NextResponse } from 'next/server';
import type { SavedItem } from '@/types';

/**
 * GET /api/saved
 * 
 * Retrieves all saved items for the authenticated user.
 * 
 * Query Parameters:
 * - type: Filter by item type ("treatment", "clinic", or omit for both)
 * 
 * @example
 * GET /api/saved?type=treatment
 * 
 * Response:
 * {
 *   savedItems: SavedItem[],
 *   total: number
 * }
 * 
 * Phase 2 Implementation:
 * - Require authentication (NextAuth session)
 * - Query Prisma for user's saved items
 * - Include full treatment/clinic details
 * - Add filtering by type
 * 
 * Phase 3 Implementation:
 * - Add NextAuth session check
 * - Return 401 if not authenticated
 */
export async function GET(request: NextRequest) {
  // TODO: Phase 3 - Add authentication check
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json(
  //     { error: 'Unauthorized' },
  //     { status: 401 }
  //   );
  // }

  // TODO: Phase 2 - Implement with Prisma
  // const { searchParams } = new URL(request.url);
  // const type = searchParams.get('type');

  // const savedItems = await prisma.savedItem.findMany({
  //   where: {
  //     userId: session.user.id,
  //     ...(type && { itemType: type }),
  //   },
  //   orderBy: { savedAt: 'desc' },
  // });

  // // Fetch full details for each saved item
  // const itemsWithDetails = await Promise.all(
  //   savedItems.map(async (item) => {
  //     if (item.itemType === 'treatment') {
  //       const treatment = await prisma.treatment.findUnique({
  //         where: { id: item.itemId },
  //       });
  //       return { ...item, details: treatment };
  //     } else {
  //       const clinic = await prisma.clinic.findUnique({
  //         where: { id: item.itemId },
  //       });
  //       return { ...item, details: clinic };
  //     }
  //   })
  // );

  return NextResponse.json(
    {
      error: 'Not implemented',
      message: 'This endpoint will be implemented in Phase 2/3 with database and authentication',
    },
    { status: 501 }
  );
}

/**
 * POST /api/saved
 * 
 * Saves a treatment or clinic for the authenticated user.
 * 
 * Request Body:
 * {
 *   itemType: 'treatment' | 'clinic',
 *   itemId: string,
 *   notes?: string
 * }
 * 
 * Response:
 * {
 *   savedItem: SavedItem
 * }
 * 
 * Phase 2 Implementation:
 * - Require authentication
 * - Create saved item in database
 * - Prevent duplicates (unique constraint)
 * - Return created item
 */
export async function POST(request: NextRequest) {
  // TODO: Phase 3 - Add authentication check
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json(
  //     { error: 'Unauthorized' },
  //     { status: 401 }
  //   );
  // }

  // TODO: Phase 2 - Implement with Prisma
  // const body = await request.json();
  // const { itemType, itemId, notes } = body;

  // // Validate input
  // if (!itemType || !itemId) {
  //   return NextResponse.json(
  //     { error: 'itemType and itemId are required' },
  //     { status: 400 }
  //   );
  // }

  // if (!['treatment', 'clinic'].includes(itemType)) {
  //   return NextResponse.json(
  //     { error: 'itemType must be "treatment" or "clinic"' },
  //     { status: 400 }
  //   );
  // }

  // // Check if item exists
  // const itemExists = itemType === 'treatment'
  //   ? await prisma.treatment.findUnique({ where: { id: itemId } })
  //   : await prisma.clinic.findUnique({ where: { id: itemId } });

  // if (!itemExists) {
  //   return NextResponse.json(
  //     { error: 'Item not found' },
  //     { status: 404 }
  //   );
  // }

  // // Create saved item (or return existing)
  // const savedItem = await prisma.savedItem.upsert({
  //   where: {
  //     userId_itemType_itemId: {
  //       userId: session.user.id,
  //       itemType,
  //       itemId,
  //     },
  //   },
  //   update: { notes },
  //   create: {
  //     userId: session.user.id,
  //     itemType,
  //     itemId,
  //     notes,
  //   },
  // });

  // return NextResponse.json({ savedItem }, { status: 201 });

  return NextResponse.json(
    {
      error: 'Not implemented',
      message: 'This endpoint will be implemented in Phase 2/3 with database and authentication',
    },
    { status: 501 }
  );
}
