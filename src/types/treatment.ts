export interface Treatment {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  priceRange: {
    min: number;
    max: number;
    currency: 'KRW' | 'USD';
  };
  duration: string; // e.g., "30-60 minutes"
  risks: string[];
  categories: string[]; // e.g., ["skin rejuvenation", "anti-aging"]
  recoveryTime: string; // e.g., "1-3 days"
  beforeAfterImages?: {
    before: string;
    after: string;
  }[];
  suitableFor?: {
    skinTypes: string[];
    ageRanges: string[];
    goals: string[];
  };
}
