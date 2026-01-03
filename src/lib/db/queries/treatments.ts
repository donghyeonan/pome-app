/**
 * Treatment Query Functions
 *
 * Reusable database query functions for treatments.
 * Used by API routes and Server Components.
 */

import { prisma } from '@/lib/prisma';
import { Prisma, Treatment } from '@prisma/client';
import { NAV_GROUPS, type NavGroupKey } from '@/config/nav-groups';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface TreatmentFilters {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  navGroup?: NavGroupKey;
  goalTags?: string[];
  modalityTags?: string[];
  areaTags?: string[];
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface TreatmentListResult {
  treatments: Treatment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─────────────────────────────────────────────────────────────
// Nav Group to Prisma Where Converter
// ─────────────────────────────────────────────────────────────
export function navGroupToPrismaWhere(
  key: NavGroupKey
): Prisma.TreatmentWhereInput {
  const group = NAV_GROUPS[key];
  const conditions: Prisma.TreatmentWhereInput[] = [];

  if (group.goals.length > 0) {
    conditions.push({ goalTags: { hasSome: group.goals } });
  }
  if (group.modalities.length > 0) {
    conditions.push({ modalityTags: { hasSome: group.modalities } });
  }
  if (group.areas.length > 0) {
    conditions.push({ areaTags: { hasSome: group.areas } });
  }

  return conditions.length > 1 ? { OR: conditions } : conditions[0] ?? {};
}

// ─────────────────────────────────────────────────────────────
// Build Where Clause
// ─────────────────────────────────────────────────────────────
function buildTreatmentWhere(
  filters: TreatmentFilters
): Prisma.TreatmentWhereInput {
  const where: Prisma.TreatmentWhereInput = {};
  const andConditions: Prisma.TreatmentWhereInput[] = [];

  // Category filter (legacy)
  if (filters.categories && filters.categories.length > 0) {
    andConditions.push({ categories: { hasSome: filters.categories } });
  }

  // Price range filter
  if (filters.priceMin !== undefined) {
    andConditions.push({ priceMin: { gte: filters.priceMin } });
  }
  if (filters.priceMax !== undefined) {
    andConditions.push({ priceMax: { lte: filters.priceMax } });
  }

  // Nav group filter (new taxonomy)
  if (filters.navGroup) {
    andConditions.push(navGroupToPrismaWhere(filters.navGroup));
  }

  // Direct tag filters
  if (filters.goalTags && filters.goalTags.length > 0) {
    andConditions.push({ goalTags: { hasSome: filters.goalTags } });
  }
  if (filters.modalityTags && filters.modalityTags.length > 0) {
    andConditions.push({ modalityTags: { hasSome: filters.modalityTags } });
  }
  if (filters.areaTags && filters.areaTags.length > 0) {
    andConditions.push({ areaTags: { hasSome: filters.areaTags } });
  }

  // Search filter
  if (filters.search) {
    andConditions.push({
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ],
    });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  return where;
}

// ─────────────────────────────────────────────────────────────
// Query Functions
// ─────────────────────────────────────────────────────────────

/**
 * Get paginated list of treatments with filters
 */
export async function getTreatments(
  filters: TreatmentFilters = {},
  pagination: PaginationOptions = {}
): Promise<TreatmentListResult> {
  const page = pagination.page ?? 1;
  const limit = pagination.limit ?? 10;
  const where = buildTreatmentWhere(filters);

  const [treatments, total] = await Promise.all([
    prisma.treatment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.treatment.count({ where }),
  ]);

  return {
    treatments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get treatment by ID
 */
export async function getTreatmentById(
  id: string
): Promise<Treatment | null> {
  return prisma.treatment.findUnique({
    where: { id },
  });
}

/**
 * Get treatment by slug
 */
export async function getTreatmentBySlug(
  slug: string
): Promise<Treatment | null> {
  return prisma.treatment.findUnique({
    where: { slug },
  });
}

/**
 * Get treatment with clinics that offer it
 */
export async function getTreatmentWithClinics(id: string) {
  return prisma.treatment.findUnique({
    where: { id },
    include: {
      clinicMappings: {
        include: {
          clinic: true,
        },
      },
    },
  });
}

/**
 * Get all treatments (no pagination)
 * Use with caution - only for small datasets
 */
export async function getAllTreatments(): Promise<Treatment[]> {
  return prisma.treatment.findMany({
    orderBy: { name: 'asc' },
  });
}

/**
 * Get treatment count
 */
export async function getTreatmentCount(
  filters: TreatmentFilters = {}
): Promise<number> {
  const where = buildTreatmentWhere(filters);
  return prisma.treatment.count({ where });
}

/**
 * Get featured treatments (for homepage)
 */
export async function getFeaturedTreatments(
  limit: number = 6
): Promise<Treatment[]> {
  return prisma.treatment.findMany({
    take: limit,
    orderBy: { name: 'asc' },
    // TODO: Add isFeatured field or popularity sorting
  });
}
