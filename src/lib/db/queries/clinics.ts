/**
 * Clinic Query Functions
 *
 * Reusable database query functions for clinics.
 * Used by API routes and Server Components.
 */

import { prisma } from '@/lib/prisma';
import { Prisma, Clinic, Treatment } from '@prisma/client';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface ClinicFilters {
  location?: string;
  verified?: boolean;
  specialties?: string[];
  priceLevel?: number;
  minRating?: number;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface ClinicListResult {
  clinics: Clinic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ClinicWithTreatments extends Clinic {
  treatments: (Treatment & { price: number | null; availability: string })[];
}

// ─────────────────────────────────────────────────────────────
// Build Where Clause
// ─────────────────────────────────────────────────────────────
function buildClinicWhere(filters: ClinicFilters): Prisma.ClinicWhereInput {
  const where: Prisma.ClinicWhereInput = {};
  const andConditions: Prisma.ClinicWhereInput[] = [];

  // Location filter
  if (filters.location) {
    andConditions.push({
      location: { contains: filters.location, mode: 'insensitive' },
    });
  }

  // Verified filter
  if (filters.verified !== undefined) {
    andConditions.push({ verified: filters.verified });
  }

  // Specialties filter
  if (filters.specialties && filters.specialties.length > 0) {
    andConditions.push({ specialties: { hasSome: filters.specialties } });
  }

  // Price level filter
  if (filters.priceLevel !== undefined) {
    andConditions.push({ priceLevel: { lte: filters.priceLevel } });
  }

  // Minimum rating filter
  if (filters.minRating !== undefined) {
    andConditions.push({ rating: { gte: filters.minRating } });
  }

  // Search filter
  if (filters.search) {
    andConditions.push({
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
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
 * Get paginated list of clinics with filters
 */
export async function getClinics(
  filters: ClinicFilters = {},
  pagination: PaginationOptions = {}
): Promise<ClinicListResult> {
  const page = pagination.page ?? 1;
  const limit = pagination.limit ?? 10;
  const where = buildClinicWhere(filters);

  const [clinics, total] = await Promise.all([
    prisma.clinic.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.clinic.count({ where }),
  ]);

  return {
    clinics,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get clinic by ID
 */
export async function getClinicById(id: string): Promise<Clinic | null> {
  return prisma.clinic.findUnique({
    where: { id },
  });
}

/**
 * Get clinic by slug
 */
export async function getClinicBySlug(slug: string): Promise<Clinic | null> {
  return prisma.clinic.findUnique({
    where: { slug },
  });
}

/**
 * Get clinic with treatments
 */
export async function getClinicWithTreatments(
  id: string
): Promise<ClinicWithTreatments | null> {
  const clinic = await prisma.clinic.findUnique({
    where: { id },
    include: {
      treatments: {
        include: {
          treatment: true,
        },
      },
    },
  });

  if (!clinic) return null;

  // Transform to include treatment details with price and availability
  const treatments = clinic.treatments.map((ct) => ({
    ...ct.treatment,
    price: ct.price,
    availability: ct.availability,
  }));

  return {
    ...clinic,
    treatments,
  };
}

/**
 * Get all clinics (no pagination)
 * Use with caution - only for small datasets
 */
export async function getAllClinics(): Promise<Clinic[]> {
  return prisma.clinic.findMany({
    orderBy: { name: 'asc' },
  });
}

/**
 * Get clinic count
 */
export async function getClinicCount(
  filters: ClinicFilters = {}
): Promise<number> {
  const where = buildClinicWhere(filters);
  return prisma.clinic.count({ where });
}

/**
 * Get featured clinics (for homepage)
 */
export async function getFeaturedClinics(limit: number = 6): Promise<Clinic[]> {
  return prisma.clinic.findMany({
    where: { verified: true },
    take: limit,
    orderBy: { rating: 'desc' },
  });
}

/**
 * Get clinics by location
 */
export async function getClinicsByLocation(
  location: string,
  limit: number = 10
): Promise<Clinic[]> {
  return prisma.clinic.findMany({
    where: {
      location: { contains: location, mode: 'insensitive' },
    },
    take: limit,
    orderBy: { rating: 'desc' },
  });
}
