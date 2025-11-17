export interface User {
  id: string;
  email: string;
  name: string;
  languagePreference: 'en' | 'ko';
  gender?: 'male' | 'female' | 'other';
  ageRange?: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  skinType?: 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';
  treatmentGoals?: string[]; // e.g., ["reduce_wrinkles", "improve_skin_tone"]
  createdAt: Date;
}

export interface SavedItem {
  id: string;
  userId: string;
  itemType: 'clinic' | 'treatment';
  itemId: string;
  savedAt: Date;
  notes?: string;
}
