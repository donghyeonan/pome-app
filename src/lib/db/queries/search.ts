/**
 * Search Query Functions
 *
 * Reusable database query functions for search.
 */

import { prisma } from '@/lib/prisma';
import { Treatment, Clinic } from '@prisma/client';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface SearchResult {
  treatments: Treatment[];
  clinics: Clinic[];
  query: string;
}

export interface SearchOptions {
  limit?: number;
  treatmentsOnly?: boolean;
  clinicsOnly?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Query Functions
// ─────────────────────────────────────────────────────────────

/**
 * Search treatments and clinics
 */
export async function search(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult> {
  const limit = options.limit ?? 10;
  const searchTreatments = !options.clinicsOnly;
  const searchClinics = !options.treatmentsOnly;

  const [treatments, clinics] = await Promise.all([
    searchTreatments
      ? prisma.treatment.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: limit,
        })
      : Promise.resolve([]),
    searchClinics
      ? prisma.clinic.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: limit,
        })
      : Promise.resolve([]),
  ]);

  return {
    treatments,
    clinics,
    query,
  };
}

/**
 * Get search suggestions (autocomplete)
 */
export async function getSearchSuggestions(
  query: string,
  limit: number = 5
): Promise<{ treatments: string[]; clinics: string[] }> {
  const [treatments, clinics] = await Promise.all([
    prisma.treatment.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      select: { name: true },
      take: limit,
    }),
    prisma.clinic.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      select: { name: true },
      take: limit,
    }),
  ]);

  return {
    treatments: treatments.map((t) => t.name),
    clinics: clinics.map((c) => c.name),
  };
}
