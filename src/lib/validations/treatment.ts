import { z } from 'zod';
import { paginationSchema } from './pagination';

export const treatmentQuerySchema = paginationSchema.extend({
  categories: z.string().optional(),
  priceMin: z.coerce.number().int().nonnegative().optional(),
  priceMax: z.coerce.number().int().nonnegative().optional(),
});

export const treatmentIdSchema = z.object({
  id: z.string().min(1),
});

export type TreatmentQuery = z.infer<typeof treatmentQuerySchema>;
export type TreatmentId = z.infer<typeof treatmentIdSchema>;
