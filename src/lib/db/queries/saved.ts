/**
 * Saved Items Query Functions
 *
 * Reusable database query functions for saved items.
 */

import { prisma } from '@/lib/prisma';
import { SavedItem, Treatment, Clinic } from '@prisma/client';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface SavedItemWithDetails extends SavedItem {
  treatment?: Treatment | null;
  clinic?: Clinic | null;
}

// ─────────────────────────────────────────────────────────────
// Query Functions
// ─────────────────────────────────────────────────────────────

/**
 * Get user's saved items with populated details
 */
export async function getSavedItemsWithDetails(
  userId: string
): Promise<SavedItemWithDetails[]> {
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

  return populatedItems;
}

/**
 * Get saved item by ID
 */
export async function getSavedItemById(
  id: string
): Promise<SavedItem | null> {
  return prisma.savedItem.findUnique({
    where: { id },
  });
}

/**
 * Create saved item
 */
export async function createSavedItem(data: {
  userId: string;
  itemType: string;
  itemId: string;
  notes?: string;
}): Promise<SavedItem> {
  return prisma.savedItem.create({
    data: {
      userId: data.userId,
      itemType: data.itemType,
      itemId: data.itemId,
      notes: data.notes,
    },
  });
}

/**
 * Delete saved item
 */
export async function deleteSavedItem(id: string): Promise<void> {
  await prisma.savedItem.delete({
    where: { id },
  });
}

/**
 * Check if item is saved by user
 */
export async function isItemSaved(
  userId: string,
  itemType: string,
  itemId: string
): Promise<boolean> {
  const item = await prisma.savedItem.findFirst({
    where: {
      userId,
      itemType,
      itemId,
    },
  });
  return item !== null;
}
