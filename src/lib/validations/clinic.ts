import { z } from 'zod';
import { paginationSchema } from './pagination';

export const clinicQuerySchema = paginationSchema.extend({
  location: z.string().optional(),
  verified: z.coerce.boolean().optional(),
  specialties: z.string().optional(),
});

export const clinicIdSchema = z.object({
  id: z.string().min(1),
});

export type ClinicQuery = z.infer<typeof clinicQuerySchema>;
export type ClinicId = z.infer<typeof clinicIdSchema>;
