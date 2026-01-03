/**
 * Taxonomy Zod Validators
 *
 * Server-side validation schemas for taxonomy tags.
 * Uses constants from lib/constants/taxonomy.ts
 *
 * IMPORTANT: This file is SERVER-ONLY.
 * Do NOT import in client components to avoid bundle bloat.
 */

import { z } from 'zod';
import {
  GOAL_TAGS,
  MODALITY_TAGS,
  AREA_TAGS,
  POSITIONING_TAGS,
} from '@/lib/constants/taxonomy';

// ─────────────────────────────────────────────────────────────
// Single Tag Validators
// ─────────────────────────────────────────────────────────────
export const goalTagSchema = z.enum(GOAL_TAGS);
export const modalityTagSchema = z.enum(MODALITY_TAGS);
export const areaTagSchema = z.enum(AREA_TAGS);
export const positioningTagSchema = z.enum(POSITIONING_TAGS);

// ─────────────────────────────────────────────────────────────
// Array Validators (for DB fields - String[])
// ─────────────────────────────────────────────────────────────
export const goalTagsArraySchema = z.array(goalTagSchema);
export const modalityTagsArraySchema = z.array(modalityTagSchema);
export const areaTagsArraySchema = z.array(areaTagSchema);
export const positioningTagsArraySchema = z.array(positioningTagSchema);

// ─────────────────────────────────────────────────────────────
// Treatment Tags Schema (for create/update operations)
// ─────────────────────────────────────────────────────────────
export const treatmentTagsSchema = z.object({
  goalTags: goalTagsArraySchema.min(1, 'At least one goal required'),
  modalityTags: modalityTagsArraySchema.optional().default([]),
  areaTags: areaTagsArraySchema.optional().default([]),
});

// ─────────────────────────────────────────────────────────────
// Device Tags Schema (for TreatmentDevice positioning)
// ─────────────────────────────────────────────────────────────
export const devicePositioningSchema = z.object({
  positioning: positioningTagsArraySchema.optional().default([]),
  bestForGoalTags: goalTagsArraySchema.optional().default([]),
});

// ─────────────────────────────────────────────────────────────
// Event Properties Validation (for POST /api/v1/events)
// ─────────────────────────────────────────────────────────────
export const eventTagsSchema = z.object({
  goalTags: goalTagsArraySchema.optional(),
  modalityTags: modalityTagsArraySchema.optional(),
  areaTags: areaTagsArraySchema.optional(),
});

// ─────────────────────────────────────────────────────────────
// Quiz Result Tags Schema
// ─────────────────────────────────────────────────────────────
export const quizResultTagsSchema = z.object({
  resultTags: goalTagsArraySchema.min(1, 'Quiz must produce at least one tag'),
  suggestedModalities: modalityTagsArraySchema.optional(),
});

// ─────────────────────────────────────────────────────────────
// Type Exports (inferred from schemas)
// ─────────────────────────────────────────────────────────────
export type TreatmentTagsInput = z.infer<typeof treatmentTagsSchema>;
export type DevicePositioningInput = z.infer<typeof devicePositioningSchema>;
export type EventTagsInput = z.infer<typeof eventTagsSchema>;
export type QuizResultTagsInput = z.infer<typeof quizResultTagsSchema>;
