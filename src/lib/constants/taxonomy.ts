/**
 * Taxonomy Constants
 *
 * Core tag sets for categorizing treatments, devices, and content.
 * These are UI + analytics primitives, not medical classifications.
 *
 * IMPORTANT: This file is shared between client and server.
 * Do NOT add Prisma or server-only dependencies here.
 */

// ─────────────────────────────────────────────────────────────
// Goal Tags - What the user wants to achieve
// ─────────────────────────────────────────────────────────────
export const GOAL_TAGS = [
  'LIFTING', // 처짐 + 탄력 (TIGHTENING 통합)
  'PORES', // 모공
  'TEXTURE', // 피부결
  'PIGMENT', // 색소 (기미, 잡티)
  'ACNE_SCARS', // 여드름 흉터
  'WRINKLES', // 주름
  'HYDRATION_GLOW', // 수분/광채
  'REDNESS_VASCULAR', // 홍조/혈관
  'BODY_CONTOURING', // 바디 윤곽
  'HAIR_REMOVAL', // 제모 (MVP에 포함, NAV는 나중에)
] as const; // 10개

// ─────────────────────────────────────────────────────────────
// Modality Tags - Treatment method/technology
// ─────────────────────────────────────────────────────────────
export const MODALITY_TAGS = [
  'RF', // 고주파
  'HIFU', // 초음파
  'PICO', // 피코 레이저
  'FRACTIONAL', // 프락셔널
  'IPL', // 광선
  'LED', // LED
  'MICRONEEDLING', // 마이크로니들
  'INJECTABLE', // 보톡스, 필러
  'THREAD', // 실리프팅
  'PEEL', // 필링 (장비 아님, 시술 방식)
  'SKINCARE', // 스킨케어 시술
  'OTHER',
] as const; // 12개

// ─────────────────────────────────────────────────────────────
// Area Tags - Treatment area on body
// ─────────────────────────────────────────────────────────────
export const AREA_TAGS = [
  'FACE', // 얼굴 전체
  'NECK', // 목
  'EYES', // 눈가
  'NOSE', // 코
  'BODY', // 바디
  'SCALP', // 두피
] as const; // 6개

// ─────────────────────────────────────────────────────────────
// Positioning Tags - Device/treatment positioning attributes
// Used in TreatmentDevice to describe how a device compares
// ─────────────────────────────────────────────────────────────
export const POSITIONING_TAGS = [
  'FasterRecovery', // 더 빠른 회복
  'StrongerEffect', // 더 강한 효과
  'Gentler', // 더 부드러움
  'LessDowntime', // 다운타임 적음
  'MoreDowntime', // 다운타임 많음
  'BestForTexture', // 피부결에 최적
  'BestForPigment', // 색소에 최적
  'BestForLifting', // 리프팅에 최적
  'SensitiveSkinOK', // 민감 피부 적합
  'DeepTreatment', // 깊은 치료
] as const; // 10개

// ─────────────────────────────────────────────────────────────
// TypeScript Types
// ─────────────────────────────────────────────────────────────
export type GoalTag = (typeof GOAL_TAGS)[number];
export type ModalityTag = (typeof MODALITY_TAGS)[number];
export type AreaTag = (typeof AREA_TAGS)[number];
export type PositioningTag = (typeof POSITIONING_TAGS)[number];

// ─────────────────────────────────────────────────────────────
// Helper Maps for Display Labels (i18n keys)
// ─────────────────────────────────────────────────────────────
export const GOAL_TAG_LABELS: Record<GoalTag, { en: string; ko: string }> = {
  LIFTING: { en: 'Lifting & Tightening', ko: '리프팅' },
  PORES: { en: 'Pores', ko: '모공' },
  TEXTURE: { en: 'Skin Texture', ko: '피부결' },
  PIGMENT: { en: 'Pigmentation', ko: '색소' },
  ACNE_SCARS: { en: 'Acne Scars', ko: '여드름 흉터' },
  WRINKLES: { en: 'Wrinkles', ko: '주름' },
  HYDRATION_GLOW: { en: 'Hydration & Glow', ko: '수분/광채' },
  REDNESS_VASCULAR: { en: 'Redness & Vascular', ko: '홍조/혈관' },
  BODY_CONTOURING: { en: 'Body Contouring', ko: '바디 윤곽' },
  HAIR_REMOVAL: { en: 'Hair Removal', ko: '제모' },
};

export const MODALITY_TAG_LABELS: Record<
  ModalityTag,
  { en: string; ko: string }
> = {
  RF: { en: 'RF (Radiofrequency)', ko: '고주파' },
  HIFU: { en: 'HIFU (Ultrasound)', ko: '하이푸' },
  PICO: { en: 'Pico Laser', ko: '피코 레이저' },
  FRACTIONAL: { en: 'Fractional Laser', ko: '프락셔널' },
  IPL: { en: 'IPL', ko: '광선' },
  LED: { en: 'LED Therapy', ko: 'LED' },
  MICRONEEDLING: { en: 'Microneedling', ko: '마이크로니들링' },
  INJECTABLE: { en: 'Injectable', ko: '주사 (보톡스/필러)' },
  THREAD: { en: 'Thread Lift', ko: '실리프팅' },
  PEEL: { en: 'Chemical Peel', ko: '필링' },
  SKINCARE: { en: 'Skincare Treatment', ko: '스킨케어' },
  OTHER: { en: 'Other', ko: '기타' },
};

export const AREA_TAG_LABELS: Record<AreaTag, { en: string; ko: string }> = {
  FACE: { en: 'Face', ko: '얼굴' },
  NECK: { en: 'Neck', ko: '목' },
  EYES: { en: 'Eye Area', ko: '눈가' },
  NOSE: { en: 'Nose', ko: '코' },
  BODY: { en: 'Body', ko: '바디' },
  SCALP: { en: 'Scalp', ko: '두피' },
};

export const POSITIONING_TAG_LABELS: Record<
  PositioningTag,
  { en: string; ko: string }
> = {
  FasterRecovery: { en: 'Faster Recovery', ko: '빠른 회복' },
  StrongerEffect: { en: 'Stronger Effect', ko: '강한 효과' },
  Gentler: { en: 'Gentler', ko: '부드러움' },
  LessDowntime: { en: 'Less Downtime', ko: '다운타임 적음' },
  MoreDowntime: { en: 'More Downtime', ko: '다운타임 많음' },
  BestForTexture: { en: 'Best for Texture', ko: '피부결 최적' },
  BestForPigment: { en: 'Best for Pigment', ko: '색소 최적' },
  BestForLifting: { en: 'Best for Lifting', ko: '리프팅 최적' },
  SensitiveSkinOK: { en: 'Sensitive Skin OK', ko: '민감 피부 가능' },
  DeepTreatment: { en: 'Deep Treatment', ko: '깊은 치료' },
};
