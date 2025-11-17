export interface Clinic {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  rating: number; // 0-5
  reviewCount?: number;
  specialties: string[];
  kakaoMapLink?: string;
  verified: boolean;
  priceLevel?: 1 | 2 | 3; // $, $$, $$$
  openingHours?: {
    [key: string]: string; // e.g., "monday": "9:00 AM - 6:00 PM"
  };
  phoneNumber?: string;
  websiteUrl?: string;
  photos?: string[];
}

export interface ClinicTreatment {
  clinicId: string;
  treatmentId: string;
  price?: number;
  availability: 'available' | 'limited' | 'unavailable';
}
