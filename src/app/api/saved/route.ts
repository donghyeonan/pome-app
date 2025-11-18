import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSavedItemSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error';

// Mock user ID for Phase 2 (will be replaced with real auth in Phase 3)
// Using the test user created in seed: test@pome.com
const MOCK_USER_ID = 'cmi2vbsbg000g7p8eoywt8baa';

export async function GET(request: NextRequest) {
  try {
    // Get user's saved items
    const savedItems = await prisma.savedItem.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { savedAt: 'desc' },
    });

    // Populate treatment or clinic data for each saved item
    const populatedItems = await Promise.all(
      savedItems.map(async (item) => {
        if (item.itemType === 'treatment') {
          const treatment = await prisma.treatment.findUnique({
            where: { id: item.itemId },
          });
          return { ...item, treatment };
        } else if (item.itemType === 'clinic') {
          const clinic = await prisma.clinic.findUnique({
            where: { id: item.itemId },
          });
          return { ...item, clinic };
        }
        return item;
      })
    );

    return Response.json({ savedItems: populatedItems });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createSavedItemSchema.parse(body);

    // Create saved item
    const savedItem = await prisma.savedItem.create({
      data: {
        userId: MOCK_USER_ID,
        itemType: data.itemType,
        itemId: data.itemId,
        notes: data.notes,
      },
    });

    return Response.json({ savedItem }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
