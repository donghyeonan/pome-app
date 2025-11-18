import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed treatments
  console.log('📝 Seeding treatments...');
  
  const botox = await prisma.treatment.upsert({
    where: { slug: 'botox' },
    update: {},
    create: {
      slug: 'botox',
      name: 'Botox',
      description:
        'Botulinum toxin injections to reduce wrinkles and fine lines by temporarily relaxing facial muscles.',
      icon: 'Syringe',
      priceMin: 200000,
      priceMax: 500000,
      currency: 'KRW',
      duration: '15-30 minutes',
      recoveryTime: 'Immediate, avoid exercise for 24 hours',
      risks: ['Bruising', 'Temporary drooping', 'Headache', 'Allergic reaction'],
      categories: ['anti-aging', 'wrinkle-reduction', 'non-surgical'],
      beforeAfterImages: {
        images: [
          {
            before: '/images/treatments/botox-before-1.jpg',
            after: '/images/treatments/botox-after-1.jpg',
          },
        ],
      },
      suitableFor: {
        skinTypes: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
        ageRanges: ['25-34', '35-44', '45-54', '55+'],
        goals: ['reduce_wrinkles', 'prevent_aging', 'smooth_forehead'],
      },
    },
  });

  const laserToning = await prisma.treatment.upsert({
    where: { slug: 'laser-toning' },
    update: {},
    create: {
      slug: 'laser-toning',
      name: 'Laser Toning',
      description:
        'Low-energy laser treatment to improve skin tone, reduce pigmentation, and enhance overall skin brightness.',
      icon: 'Sparkles',
      priceMin: 100000,
      priceMax: 300000,
      currency: 'KRW',
      duration: '20-30 minutes',
      recoveryTime: 'Immediate, mild redness for 1-2 hours',
      risks: ['Mild redness', 'Temporary sensitivity', 'Rare pigmentation changes'],
      categories: ['skin-rejuvenation', 'pigmentation', 'brightening'],
      beforeAfterImages: {
        images: [
          {
            before: '/images/treatments/laser-before-1.jpg',
            after: '/images/treatments/laser-after-1.jpg',
          },
        ],
      },
      suitableFor: {
        skinTypes: ['dry', 'oily', 'combination', 'normal'],
        ageRanges: ['18-24', '25-34', '35-44', '45-54'],
        goals: ['improve_skin_tone', 'reduce_pigmentation', 'brighten_skin'],
      },
    },
  });

  const rhinoplasty = await prisma.treatment.upsert({
    where: { slug: 'rhinoplasty' },
    update: {},
    create: {
      slug: 'rhinoplasty',
      name: 'Rhinoplasty',
      description:
        'Surgical nose reshaping to improve appearance and/or breathing function.',
      icon: 'Wind',
      priceMin: 3000000,
      priceMax: 8000000,
      currency: 'KRW',
      duration: '2-3 hours',
      recoveryTime: '1-2 weeks for initial recovery, 6-12 months for final results',
      risks: [
        'Swelling',
        'Bruising',
        'Infection',
        'Breathing difficulties',
        'Revision may be needed',
      ],
      categories: ['facial-surgery', 'nose-reshaping', 'cosmetic-surgery'],
      beforeAfterImages: {
        images: [
          {
            before: '/images/treatments/rhinoplasty-before-1.jpg',
            after: '/images/treatments/rhinoplasty-after-1.jpg',
          },
        ],
      },
      suitableFor: {
        skinTypes: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
        ageRanges: ['18-24', '25-34', '35-44', '45-54'],
        goals: ['reshape_nose', 'improve_breathing', 'enhance_profile'],
      },
    },
  });

  console.log(`✅ Created ${3} treatments`);

  // Seed clinics
  console.log('🏥 Seeding clinics...');

  const gangnamClinic = await prisma.clinic.upsert({
    where: { slug: 'gangnam-beauty-clinic' },
    update: {},
    create: {
      slug: 'gangnam-beauty-clinic',
      name: 'Gangnam Beauty Clinic',
      location: 'Gangnam',
      address: 'Gangnam-gu, Seoul',
      description:
        'Premier cosmetic surgery clinic specializing in facial contouring, rhinoplasty, and anti-aging treatments.',
      imageUrl: '/images/clinics/gangnam-beauty.jpg',
      rating: 4.8,
      reviewCount: 342,
      specialties: ['Rhinoplasty', 'Double Eyelid Surgery', 'Facial Contouring', 'Botox'],
      kakaoMapLink: 'https://map.kakao.com/gangnam-beauty-clinic',
      verified: true,
      priceLevel: 3,
      openingHours: {
        monday: '10:00 AM - 7:00 PM',
        tuesday: '10:00 AM - 7:00 PM',
        wednesday: '10:00 AM - 7:00 PM',
        thursday: '10:00 AM - 7:00 PM',
        friday: '10:00 AM - 7:00 PM',
        saturday: '10:00 AM - 5:00 PM',
        sunday: 'Closed',
      },
      phoneNumber: '+82-2-1234-5678',
      websiteUrl: 'https://gangnambeauty.kr',
      photos: [
        '/images/clinics/gangnam-beauty-1.jpg',
        '/images/clinics/gangnam-beauty-2.jpg',
      ],
    },
  });

  const apgujeongClinic = await prisma.clinic.upsert({
    where: { slug: 'apgujeong-aesthetic-center' },
    update: {},
    create: {
      slug: 'apgujeong-aesthetic-center',
      name: 'Apgujeong Aesthetic Center',
      location: 'Apgujeong',
      address: 'Apgujeong-dong, Gangnam-gu, Seoul',
      description:
        'Luxury aesthetic clinic offering comprehensive anti-aging solutions and non-surgical facial treatments.',
      imageUrl: '/images/clinics/apgujeong-aesthetic.jpg',
      rating: 4.9,
      reviewCount: 456,
      specialties: ['Thread Lift', 'Ultherapy', 'Botox', 'Laser Treatments'],
      kakaoMapLink: 'https://map.kakao.com/apgujeong-aesthetic',
      verified: true,
      priceLevel: 3,
      openingHours: {
        monday: '10:00 AM - 8:00 PM',
        tuesday: '10:00 AM - 8:00 PM',
        wednesday: '10:00 AM - 8:00 PM',
        thursday: '10:00 AM - 8:00 PM',
        friday: '10:00 AM - 8:00 PM',
        saturday: '10:00 AM - 6:00 PM',
        sunday: '10:00 AM - 4:00 PM',
      },
      phoneNumber: '+82-2-3456-7890',
      websiteUrl: 'https://apgujeongaesthetic.kr',
      photos: ['/images/clinics/apgujeong-1.jpg', '/images/clinics/apgujeong-2.jpg'],
    },
  });

  const itaewonClinic = await prisma.clinic.upsert({
    where: { slug: 'itaewon-international-clinic' },
    update: {},
    create: {
      slug: 'itaewon-international-clinic',
      name: 'Itaewon International Clinic',
      location: 'Itaewon',
      address: 'Itaewon-dong, Yongsan-gu, Seoul',
      description:
        'International clinic with multilingual staff. Comprehensive cosmetic and medical dermatology services.',
      imageUrl: '/images/clinics/itaewon-international.jpg',
      rating: 4.7,
      reviewCount: 298,
      specialties: ['Botox', 'Dermal Fillers', 'Laser Treatments', 'Microneedling'],
      kakaoMapLink: 'https://map.kakao.com/itaewon-international',
      verified: true,
      priceLevel: 2,
      openingHours: {
        monday: '9:00 AM - 7:00 PM',
        tuesday: '9:00 AM - 7:00 PM',
        wednesday: '9:00 AM - 7:00 PM',
        thursday: '9:00 AM - 7:00 PM',
        friday: '9:00 AM - 7:00 PM',
        saturday: '10:00 AM - 5:00 PM',
        sunday: 'Closed',
      },
      phoneNumber: '+82-2-5678-9012',
      websiteUrl: 'https://itaewoninternational.com',
      photos: ['/images/clinics/itaewon-1.jpg', '/images/clinics/itaewon-2.jpg'],
    },
  });

  console.log(`✅ Created ${3} clinics`);

  // Seed clinic-treatment relationships
  console.log('🔗 Creating clinic-treatment relationships...');

  await prisma.clinicTreatment.upsert({
    where: {
      clinicId_treatmentId: {
        clinicId: gangnamClinic.id,
        treatmentId: botox.id,
      },
    },
    update: {},
    create: {
      clinicId: gangnamClinic.id,
      treatmentId: botox.id,
      price: 350000,
      availability: 'available',
    },
  });

  await prisma.clinicTreatment.upsert({
    where: {
      clinicId_treatmentId: {
        clinicId: gangnamClinic.id,
        treatmentId: rhinoplasty.id,
      },
    },
    update: {},
    create: {
      clinicId: gangnamClinic.id,
      treatmentId: rhinoplasty.id,
      price: 5000000,
      availability: 'available',
    },
  });

  await prisma.clinicTreatment.upsert({
    where: {
      clinicId_treatmentId: {
        clinicId: apgujeongClinic.id,
        treatmentId: botox.id,
      },
    },
    update: {},
    create: {
      clinicId: apgujeongClinic.id,
      treatmentId: botox.id,
      price: 400000,
      availability: 'available',
    },
  });

  await prisma.clinicTreatment.upsert({
    where: {
      clinicId_treatmentId: {
        clinicId: itaewonClinic.id,
        treatmentId: botox.id,
      },
    },
    update: {},
    create: {
      clinicId: itaewonClinic.id,
      treatmentId: botox.id,
      price: 300000,
      availability: 'available',
    },
  });

  await prisma.clinicTreatment.upsert({
    where: {
      clinicId_treatmentId: {
        clinicId: itaewonClinic.id,
        treatmentId: laserToning.id,
      },
    },
    update: {},
    create: {
      clinicId: itaewonClinic.id,
      treatmentId: laserToning.id,
      price: 200000,
      availability: 'available',
    },
  });

  console.log(`✅ Created ${5} clinic-treatment relationships`);

  // Seed test users with hashed passwords
  console.log('👤 Creating test users...');

  // Hash the test password (password123)
  const testPasswordHash = await bcrypt.hash('password123', 10);

  const testUser1 = await prisma.user.upsert({
    where: { email: 'test@pome.com' },
    update: {},
    create: {
      email: 'test@pome.com',
      passwordHash: testPasswordHash,
      name: 'Test User',
      language: 'en',
      gender: 'prefer-not-to-say',
      ageRange: '25-34',
      skinType: 'combination',
      treatmentGoals: {
        goals: ['reduce_wrinkles', 'improve_skin_tone', 'brighten_skin'],
      },
    },
  });

  const sarahKim = await prisma.user.upsert({
    where: { email: 'sarah.kim@example.com' },
    update: {},
    create: {
      email: 'sarah.kim@example.com',
      passwordHash: testPasswordHash,
      name: 'Sarah Kim',
      language: 'en',
      gender: 'female',
      ageRange: '25-34',
      skinType: 'dry',
      treatmentGoals: {
        goals: ['reduce_wrinkles', 'anti_aging', 'hydration'],
      },
    },
  });

  const johnPark = await prisma.user.upsert({
    where: { email: 'john.park@example.com' },
    update: {},
    create: {
      email: 'john.park@example.com',
      passwordHash: testPasswordHash,
      name: 'John Park',
      language: 'en',
      gender: 'male',
      ageRange: '35-44',
      skinType: 'oily',
      treatmentGoals: {
        goals: ['reduce_acne_scars', 'improve_skin_tone', 'oil_control'],
      },
    },
  });

  const minjiLee = await prisma.user.upsert({
    where: { email: 'minji.lee@example.com' },
    update: {},
    create: {
      email: 'minji.lee@example.com',
      passwordHash: testPasswordHash,
      name: 'Minji Lee',
      language: 'ko',
      gender: 'female',
      ageRange: '18-24',
      skinType: 'sensitive',
      treatmentGoals: {
        goals: ['brighten_skin', 'reduce_pigmentation', 'gentle_treatment'],
      },
    },
  });

  const emmaChen = await prisma.user.upsert({
    where: { email: 'emma.chen@example.com' },
    update: {},
    create: {
      email: 'emma.chen@example.com',
      passwordHash: testPasswordHash,
      name: 'Emma Chen',
      language: 'zh',
      gender: 'female',
      ageRange: '25-34',
      skinType: 'combination',
      treatmentGoals: {
        goals: ['anti_aging', 'skin_tightening', 'reduce_fine_lines'],
      },
    },
  });

  console.log(`✅ Created 5 test users with email/password: <email>/password123`);
  console.log(`   - ${testUser1.email}`);
  console.log(`   - ${sarahKim.email}`);
  console.log(`   - ${johnPark.email}`);
  console.log(`   - ${minjiLee.email}`);
  console.log(`   - ${emmaChen.email}`);

  console.log('✨ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
