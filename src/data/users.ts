import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'sarah.kim@example.com',
    name: 'Sarah Kim',
    languagePreference: 'en',
    gender: 'female',
    ageRange: '25-34',
    skinType: 'combination',
    treatmentGoals: ['reduce_wrinkles', 'improve_skin_tone', 'brighten_skin'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    email: 'john.park@example.com',
    name: 'John Park',
    languagePreference: 'en',
    gender: 'male',
    ageRange: '35-44',
    skinType: 'normal',
    treatmentGoals: ['prevent_aging', 'reduce_wrinkles', 'tighten_skin'],
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'user-3',
    email: 'minji.lee@example.com',
    name: '이민지',
    languagePreference: 'ko',
    gender: 'female',
    ageRange: '18-24',
    skinType: 'oily',
    treatmentGoals: ['clear_acne', 'improve_texture', 'reduce_pigmentation'],
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'user-4',
    email: 'emma.chen@example.com',
    name: 'Emma Chen',
    languagePreference: 'en',
    gender: 'female',
    ageRange: '45-54',
    skinType: 'dry',
    treatmentGoals: ['restore_volume', 'lift_sagging_skin', 'reduce_wrinkles'],
    createdAt: new Date('2024-04-05'),
  },
  {
    id: 'user-5',
    email: 'test@example.com',
    name: 'Test User',
    languagePreference: 'en',
    gender: 'other',
    ageRange: '25-34',
    skinType: 'sensitive',
    treatmentGoals: ['hydrate_skin', 'improve_glow', 'gentle_treatment'],
    createdAt: new Date('2024-05-01'),
  },
];

// Default mock user for testing (password: "password123")
export const defaultMockUser: User = mockUsers[0];
