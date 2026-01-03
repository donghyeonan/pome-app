/**
 * Query Functions Index
 *
 * Central export for all database query functions.
 */

// Treatments
export {
  getTreatments,
  getTreatmentById,
  getTreatmentBySlug,
  getTreatmentWithClinics,
  getAllTreatments,
  getTreatmentCount,
  getFeaturedTreatments,
  navGroupToPrismaWhere,
  type TreatmentFilters,
  type TreatmentListResult,
} from './treatments';

// Clinics
export {
  getClinics,
  getClinicById,
  getClinicBySlug,
  getClinicWithTreatments,
  getAllClinics,
  getClinicCount,
  getFeaturedClinics,
  getClinicsByLocation,
  type ClinicFilters,
  type ClinicListResult,
  type ClinicWithTreatments,
} from './clinics';

// Users
export {
  getUserById,
  getUserByEmail,
  getUserByEmailWithPassword,
  emailExists,
  getUserSavedItems,
  getUserCount,
  updateUserProfile,
  type SafeUser,
} from './users';

// Search
export {
  search,
  getSearchSuggestions,
  type SearchResult,
  type SearchOptions,
} from './search';

// Saved Items
export {
  getSavedItemsWithDetails,
  getSavedItemById,
  createSavedItem,
  deleteSavedItem,
  isItemSaved,
  type SavedItemWithDetails,
} from './saved';

// Common types
export type { PaginationOptions } from './treatments';
