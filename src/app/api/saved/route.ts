import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSavedItemSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error';
import { requireAuthAPI } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuthAPI();
    if (auth instanceof NextResponse) return auth;

    const { userId } = auth;

    // Get user's saved items
    const savedItems = await prisma.savedItem.findMany({
      where: { userId },
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
    // Require authentication
    const auth = await requireAuthAPI();
    if (auth instanceof NextResponse) return auth;

    const { userId } = auth;

    const body = await request.json();
    const data = createSavedItemSchema.parse(body);

    // Create saved item
    const savedItem = await prisma.savedItem.create({
      data: {
        userId,
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
