import { z } from 'zod';

export const createSavedItemSchema = z.object({
  itemType: z.enum(['clinic', 'treatment']),
  itemId: z.string().min(1),
  notes: z.string().optional(),
});

export const savedItemIdSchema = z.object({
  id: z.string().min(1),
});

export type CreateSavedItem = z.infer<typeof createSavedItemSchema>;
export type SavedItemId = z.infer<typeof savedItemIdSchema>;
