import { Treatment } from '@/types';

export const treatments: Treatment[] = [
  {
    id: 'botox-1',
    name: 'Botox',
    description:
      'Botulinum toxin injections to reduce wrinkles and fine lines by temporarily relaxing facial muscles.',
    icon: 'Syringe',
    priceRange: {
      min: 200000,
      max: 500000,
      currency: 'KRW',
    },
    duration: '15-30 minutes',
    risks: ['Bruising', 'Temporary drooping', 'Headache', 'Allergic reaction'],
    categories: ['anti-aging', 'wrinkle reduction', 'non-surgical'],
    recoveryTime: 'Immediate, avoid exercise for 24 hours',
    beforeAfterImages: [
      {
        before: '/images/treatments/botox-before-1.jpg',
        after: '/images/treatments/botox-after-1.jpg',
      },
    ],
    suitableFor: {
      skinTypes: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
      ageRanges: ['25-34', '35-44', '45-54', '55+'],
      goals: ['reduce_wrinkles', 'prevent_aging', 'smooth_forehead'],
    },
  },
  {
    id: 'laser-toning-2',
    name: 'Laser Toning',
    description:
      'Low-energy laser treatment to improve skin tone, reduce pigmentation, and enhance overall skin brightness.',
    icon: 'Sparkles',
    priceRange: {
      min: 100000,
      max: 300000,
      currency: 'KRW',
    },
    duration: '20-30 minutes',
    risks: [
      'Mild redness',
      'Temporary sensitivity',
      'Rare pigmentation changes',
    ],
    categories: ['skin rejuvenation', 'pigmentation', 'brightening'],
    recoveryTime: 'Immediate, mild redness for 1-2 hours',
    beforeAfterImages: [
      {
        before: '/images/treatments/laser-before-1.jpg',
        after: '/images/treatments/laser-after-1.jpg',
      },
    ],
    suitableFor: {
      skinTypes: ['dry', 'oily', 'combination', 'normal'],
      ageRanges: ['18-24', '25-34', '35-44', '45-54'],
      goals: ['improve_skin_tone', 'reduce_pigmentation', 'brighten_skin'],
    },
  },
  {
    id: 'dermal-filler-3',
    name: 'Dermal Fillers',
    description:
      'Hyaluronic acid injections to restore volume, smooth wrinkles, and enhance facial contours.',
    icon: 'Droplet',
    priceRange: {
      min: 400000,
      max: 1000000,
      currency: 'KRW',
    },
    duration: '30-60 minutes',
    risks: ['Swelling', 'Bruising', 'Asymmetry', 'Rare vascular complications'],
    categories: ['volume restoration', 'anti-aging', 'facial contouring'],
    recoveryTime: '1-3 days, swelling subsides within a week',
    beforeAfterImages: [
      {
        before: '/images/treatments/filler-before-1.jpg',
        after: '/images/treatments/filler-after-1.jpg',
      },
    ],
    suitableFor: {
      skinTypes: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
      ageRanges: ['25-34', '35-44', '45-54', '55+'],
      goals: ['restore_volume', 'enhance_lips', 'smooth_wrinkles'],
    },
  },
  {
    id: 'chemical-peel-4',
    name: 'Chemical Peel',
    description:
      'Application of chemical solution to exfoliate skin, improve texture, and reduce acne scars and pigmentation.',
    icon: 'Droplets',
    priceRange: {
      min: 150000,
      max: 400000,
      currency: 'KRW',
    },
    duration: '30-45 minutes',
    risks: ['Redness', 'Peeling', 'Sensitivity', 'Rare scarring'],
    categories: ['skin rejuvenation', 'acne treatment', 'texture improvement'],
    recoveryTime: '3-7 days depending on peel depth',
    beforeAfterImages: [
      {
        before: '/images/treatments/peel-before-1.jpg',
        after: '/images/treatments/peel-after-1.jpg',
      },
    ],
    suitableFor: {
      skinTypes: ['oily', 'combination', 'normal'],
      ageRanges: ['18-24', '25-34', '35-44', '45-54'],
      goals: ['improve_texture', 'reduce_acne_scars', 'brighten_skin'],
    },
  },
  {
    id: 'microneedling-5',
    name: 'Microneedling',
    description:
      'Collagen induction therapy using fine needles to improve skin texture, reduce scars, and enhance product absorption.',
    icon: 'Zap',
    priceRange: {
      min: 200000,
      max: 500000,
      currency: 'KRW',
    },
    duration: '45-60 minutes',
    risks: [
      'Redness',
      'Swelling',
      'Minor bleeding',
      'Infection if not sterile',
    ],
    categories: ['skin rejuvenation', 'scar treatment', 'texture improvement'],
    recoveryTime: '2-3 days, redness subsides within 24-48 hours',
    beforeAfterImages: [
      {
        before: '/images/treatments/microneedling-before-1.jpg',
        after: '/images/treatments/microneedling-after-1.jpg',
      },
    ],
    suitableFor: {
      skinTypes: ['dry', 'oily', 'combination', 'normal'],
      ageRanges: ['18-24', '25-34', '35-44', '45-54'],
      goals: ['improve_texture', 'reduce_scars', 'boost_collagen'],
    },
  },
  {
    id: 'rhinoplasty-6',
    name: 'Rhinoplasty',
    description:
      'Surgical nose reshaping to improve appearance and/or breathing function.',
    icon: 'Wind',
    priceRange: {
      min: 3000000,
      max: 8000000,
      currency: 'KRW',
    },
    duration: '2-3 hours',
    risks: [
      'Swelling',
      'Bruising',
      'Infection',
      'Breathing difficulties',
      'Revision may be needed',
    ],
    categories: ['facial surgery', 'nose reshaping', 'cosmetic surgery'],
    recoveryTime:
      '1-2 weeks for initial recovery, 6-12 months for final results',
    beforeAfterImages: [
      {
        before: '/images/treatments/rhinoplasty-before-1.jpg',
        after: '/images/treatments/rhinoplasty-after-1.jpg',
      },
    ],
    suitableFor: {
      skinTypes: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
      ageRanges: ['18-24', '25-34', '35-44', '45-54'],
      goals: ['reshape_nose', 'improve_breathing', 'enhance_profile'],
    },
  },
  {
    id: 'double-eyelid-7',
    name: 'Double Eyelid Surgery',
    description:
      'Blepharoplasty to create or enhance the eyelid crease for larger, more defined eyes.',
    icon: 'Eye',
    priceRange: {
      min: 1500000,
      max: 4000000,
      currency: 'KRW',
    },
    duration: '1-2 hours',
    risks: ['Swelling', 'Bruising', 'Asymmetry', 'Scarring', 'Dry eyes'],
    categories: ['eye surgery', 'facial surgery', 'cosmetic surgery'],
    recoveryTime:
      '1-2 weeks for initial recovery, 3-6 months for final results',
    beforeAfterImages: [
      {
        before: '/images/treatments/eyelid-before-1.jpg',
        after: '/images/treatments/eyelid-after-1.jpg',
      },
    ],
    suitableFor: {
      skinTypes: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
      ageRanges: ['18-24', '25-34', '35-44', '45-54'],
      goals: ['enhance_eyes', 'create_eyelid_crease', 'look_more_awake'],
    },
  },
  {
    id: 'thread-lift-8',
    name: 'Thread Lift',
    description:
      'Minimally invasive procedure using dissolvable threads to lift and tighten sagging skin.',
    icon: 'Move',
    priceRange: {
      min: 1000000,
      max: 3000000,
      currency: 'KRW',
    },
    duration: '45-90 minutes',
    risks: [
      'Bruising',
      'Swelling',
      'Thread visibility',
      'Asymmetry',
      'Infection',
    ],
    categories: ['facial lifting', 'non-surgical', 'anti-aging'],
    recoveryTime: '3-5 days, avoid strenuous activity for 2 weeks',
    beforeAfterImages: [
      {
        before: '/images/treatments/thread-before-1.jpg',
        after: '/images/treatments/thread-after-1.jpg',
      },
    ],
    suitableFor: {
      skinTypes: ['dry', 'oily', 'combination', 'normal'],
      ageRanges: ['35-44', '45-54', '55+'],
      goals: ['lift_sagging_skin', 'define_jawline', 'reduce_jowls'],
    },
  },
  {
    id: 'hydrafacial-9',
    name: 'HydraFacial',
    description:
      'Multi-step facial treatment that cleanses, exfoliates, extracts, and hydrates skin using patented technology.',
    icon: 'Waves',
    priceRange: {
      min: 150000,
      max: 350000,
      currency: 'KRW',
    },
    duration: '30-45 minutes',
    risks: ['Minimal risks', 'Temporary redness', 'Rare sensitivity'],
    categories: ['skin rejuvenation', 'hydration', 'deep cleansing'],
    recoveryTime: 'Immediate, no downtime',
    beforeAfterImages: [
      {
        before: '/images/treatments/hydrafacial-before-1.jpg',
        after: '/images/treatments/hydrafacial-after-1.jpg',
      },
    ],
    suitableFor: {
      skinTypes: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
      ageRanges: ['18-24', '25-34', '35-44', '45-54', '55+'],
      goals: ['hydrate_skin', 'deep_cleanse', 'improve_glow'],
    },
  },
  {
    id: 'ultherapy-10',
    name: 'Ultherapy',
    description:
      'Non-invasive ultrasound treatment to lift and tighten skin on the face, neck, and décolletage.',
    icon: 'Radio',
    priceRange: {
      min: 1500000,
      max: 4000000,
      currency: 'KRW',
    },
    duration: '60-90 minutes',
    risks: ['Temporary redness', 'Swelling', 'Tingling', 'Rare nerve injury'],
    categories: ['skin tightening', 'non-surgical', 'anti-aging'],
    recoveryTime: 'Immediate, results develop over 2-3 months',
    beforeAfterImages: [
      {
        before: '/images/treatments/ultherapy-before-1.jpg',
        after: '/images/treatments/ultherapy-after-1.jpg',
      },
    ],
    suitableFor: {
      skinTypes: ['dry', 'oily', 'combination', 'normal'],
      ageRanges: ['35-44', '45-54', '55+'],
      goals: ['tighten_skin', 'lift_face', 'reduce_sagging'],
    },
  },
  {
    id: 'lip-filler-11',
    name: 'Lip Filler',
    description:
      'Hyaluronic acid injections to enhance lip volume, shape, and definition.',
    icon: 'Heart',
    priceRange: {
      min: 300000,
      max: 700000,
      currency: 'KRW',
    },
    duration: '20-30 minutes',
    risks: [
      'Swelling',
      'Bruising',
      'Asymmetry',
      'Lumps',
      'Rare vascular complications',
    ],
    categories: ['lip enhancement', 'volume restoration', 'facial contouring'],
    recoveryTime: '1-2 days, swelling subsides within a week',
    beforeAfterImages: [
      {
        before: '/images/treatments/lip-before-1.jpg',
        after: '/images/treatments/lip-after-1.jpg',
      },
    ],
    suitableFor: {
      skinTypes: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
      ageRanges: ['18-24', '25-34', '35-44', '45-54'],
      goals: ['enhance_lips', 'add_volume', 'define_lip_shape'],
    },
  },
  {
    id: 'acne-treatment-12',
    name: 'Acne Treatment',
    description:
      'Comprehensive treatment combining medications, chemical peels, and laser therapy to treat active acne and prevent scarring.',
    icon: 'Shield',
    priceRange: {
      min: 100000,
      max: 500000,
      currency: 'KRW',
    },
    duration: '30-60 minutes per session',
    risks: ['Dryness', 'Redness', 'Purging period', 'Sensitivity'],
    categories: ['acne treatment', 'skin health', 'medical dermatology'],
    recoveryTime: 'Varies, ongoing treatment over several months',
    beforeAfterImages: [
      {
        before: '/images/treatments/acne-before-1.jpg',
        after: '/images/treatments/acne-after-1.jpg',
      },
    ],
    suitableFor: {
      skinTypes: ['oily', 'combination', 'sensitive'],
      ageRanges: ['18-24', '25-34', '35-44'],
      goals: ['clear_acne', 'prevent_scarring', 'improve_skin_health'],
    },
  },
];
