import { Treatment } from './treatment';
import { Clinic } from './clinic';

export interface SearchResult {
  treatments: Treatment[];
  clinics: Clinic[];
  query: string;
  resultType: 'treatment' | 'clinic' | 'mixed';
}
