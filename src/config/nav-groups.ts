/**
 * Navigation Groups Configuration
 *
 * DSL format for UI navigation groups.
 * Maps navigation categories to tag filters.
 *
 * IMPORTANT: This file has NO Prisma dependency.
 * Safe to import in client components.
 *
 * Prisma conversion happens in lib/db/queries/treatments.ts
 */

import type { GoalTag, ModalityTag, AreaTag } from '@/lib/constants/taxonomy';

// ─────────────────────────────────────────────────────────────
// Navigation Group DSL Type
// ─────────────────────────────────────────────────────────────
export interface NavGroup {
  label: { en: string; ko: string };
  goals: GoalTag[];
  modalities: ModalityTag[];
  areas: AreaTag[];
  icon?: string; // Optional icon identifier for UI
}

// ─────────────────────────────────────────────────────────────
// Navigation Groups Definition
// ─────────────────────────────────────────────────────────────
export const NAV_GROUPS = {
  lifting: {
    label: { en: 'Lifting', ko: '리프팅' },
    goals: ['LIFTING'],
    modalities: ['RF', 'HIFU', 'THREAD'], // OR condition
    areas: [],
    icon: 'arrow-up-circle',
  },
  skin: {
    label: { en: 'Skin', ko: '피부' },
    goals: ['TEXTURE', 'PORES', 'HYDRATION_GLOW', 'REDNESS_VASCULAR'],
    modalities: [],
    areas: [],
    icon: 'sparkles',
  },
  pigment: {
    label: { en: 'Pigment', ko: '색소' },
    goals: ['PIGMENT'],
    modalities: [],
    areas: [],
    icon: 'sun',
  },
  acne_scars: {
    label: { en: 'Acne Scars', ko: '여드름 흉터' },
    goals: ['ACNE_SCARS'],
    modalities: [],
    areas: [],
    icon: 'zap',
  },
  wrinkles: {
    label: { en: 'Wrinkles', ko: '주름' },
    goals: ['WRINKLES'],
    modalities: [],
    areas: [],
    icon: 'activity',
  },
  body: {
    label: { en: 'Body', ko: '바디' },
    goals: ['BODY_CONTOURING'],
    modalities: [],
    areas: ['BODY'], // OR condition
    icon: 'user',
  },
} as const satisfies Record<string, NavGroup>;

// ─────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────
export type NavGroupKey = keyof typeof NAV_GROUPS;

// Helper to get all nav group keys
export const NAV_GROUP_KEYS = Object.keys(NAV_GROUPS) as NavGroupKey[];

// Helper to get nav group by key with type safety
export function getNavGroup(key: NavGroupKey): NavGroup {
  return NAV_GROUPS[key];
}

// ─────────────────────────────────────────────────────────────
// Display Order (for UI rendering)
// ─────────────────────────────────────────────────────────────
export const NAV_GROUP_ORDER: NavGroupKey[] = [
  'lifting',
  'skin',
  'pigment',
  'acne_scars',
  'wrinkles',
  'body',
];
