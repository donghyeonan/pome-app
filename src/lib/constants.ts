// Application routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  TREATMENTS: '/treatments',
  TREATMENT_DETAIL: (id: string) => `/treatments/${id}`,
  CLINICS: '/clinics',
  CLINIC_DETAIL: (id: string) => `/clinics/${id}`,
  SEARCH: '/search',
  SAVED: '/saved',
  PROFILE: '/profile',
} as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  '/treatments',
  '/clinics',
  '/search',
  '/saved',
  '/profile',
] as const;

// Application labels
export const LABELS = {
  APP_NAME: 'Pome',
  TAGLINE: 'Your Trusted Guide to Beauty in Korea',
  NAV: {
    HOME: 'Home',
    PROCEDURES: 'Procedures',
    CLINICS: 'Clinics',
    SAVED: 'Saved',
    PROFILE: 'Profile',
  },
} as const;

// Search configuration
export const SEARCH_CONFIG = {
  DEBOUNCE_MS: 300,
  MAX_AUTOCOMPLETE_RESULTS: 10,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_USER: 'pome_auth_user',
  SAVED_ITEMS: 'pome_saved_items',
  LANGUAGE: 'pome_language',
  THEME: 'pome_theme',
  REDIRECT_AFTER_LOGIN: 'pome_redirect_after_login',
} as const;

// Treatment categories
export const TREATMENT_CATEGORIES = [
  'anti-aging',
  'skin rejuvenation',
  'acne treatment',
  'pigmentation',
  'facial surgery',
  'non-surgical',
  'volume restoration',
  'skin tightening',
] as const;

// Skin types
export const SKIN_TYPES = [
  { value: 'dry', label: 'Dry' },
  { value: 'oily', label: 'Oily' },
  { value: 'combination', label: 'Combination' },
  { value: 'sensitive', label: 'Sensitive' },
  { value: 'normal', label: 'Normal' },
] as const;

// Age ranges
export const AGE_RANGES = [
  { value: '18-24', label: '18-24' },
  { value: '25-34', label: '25-34' },
  { value: '35-44', label: '35-44' },
  { value: '45-54', label: '45-54' },
  { value: '55+', label: '55+' },
] as const;

// Price levels
export const PRICE_LEVELS = [
  { value: 1, label: '$', description: 'Budget-friendly' },
  { value: 2, label: '$$', description: 'Moderate' },
  { value: 3, label: '$$$', description: 'Premium' },
] as const;
