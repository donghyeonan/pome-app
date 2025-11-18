# Pome - Your Trusted Guide to Beauty in Korea

A modern, full-stack web application for discovering dermatology cosmetic procedures and clinics in Korea. Built with Next.js 14+ App Router, TypeScript, and a focus on performance, accessibility, and internationalization.

## 🌟 Features

- **Treatment Discovery**: Browse and search dermatology procedures with detailed information
- **Clinic Directory**: Find verified clinics with ratings, locations, and specialties
- **Smart Search**: Autocomplete search with intelligent result categorization
- **Saved Items**: Bookmark favorite treatments and clinics
- **User Authentication**: Email/Password and Google OAuth sign-in ⭐
- **Account Linking**: Automatic linking of Google accounts to existing users
- **Multi-language Support**: English (with Korean, Chinese, Japanese coming soon)
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Mobile-first design that works on all devices
- **Protected Routes**: Authentication-based access control for premium features

## 🚀 Tech Stack

### Core
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Runtime**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Font**: Inter (via next/font)

### Internationalization
- **i18n Library**: next-intl
- **Supported Languages**: English (en), Korean (ko), Chinese (zh), Japanese (ja)
- **Translation Management**: JSON-based translation files

### Backend & Database (Phase 2+)
- **Database**: Neon (Serverless PostgreSQL)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v4.24.13
  - Email/Password (Credentials Provider)
  - Google OAuth (OAuth Provider)
  - JWT session strategy
  - PrismaAdapter for database sessions
- **Email Service**: Resend (transactional emails)
- **Deployment**: Vercel

## 📁 Project Structure

```
pome-app/
├── messages/                      # i18n translation files
│   ├── en.json                   # English translations
│   ├── ko.json                   # Korean translations (placeholder)
│   ├── zh.json                   # Chinese translations (placeholder)
│   ├── ja.json                   # Japanese translations (placeholder)
│   ├── README.md                 # Translation documentation
│   └── TRANSLATION_WORKFLOW.md   # Translation workflow guide
│
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── [locale]/            # Locale-based routing
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── login/           # Login page
│   │   │   ├── treatments/      # Treatments list & detail
│   │   │   ├── clinics/         # Clinics list & detail
│   │   │   ├── search/          # Search results
│   │   │   ├── saved/           # Saved items
│   │   │   └── profile/         # User profile
│   │   └── layout.tsx           # Root layout
│   │
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components (Header, BottomNav)
│   │   ├── search/             # Search components
│   │   ├── cards/              # Card components
│   │   ├── forms/              # Form components
│   │   ├── auth/               # Authentication components
│   │   ├── profile/            # Profile components
│   │   ├── treatments/         # Treatment-specific components
│   │   ├── clinics/            # Clinic-specific components
│   │   ├── saved/              # Saved items components
│   │   └── filters/            # Filter components
│   │
│   ├── contexts/               # React contexts
│   │   └── auth-context.tsx   # Authentication context
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-auth.ts        # Authentication hook
│   │   ├── use-language.ts    # Language switching hook
│   │   ├── use-search.ts      # Search functionality hook
│   │   ├── use-saved-items.ts # Saved items hook
│   │   └── use-protected-route.ts # Route protection hook
│   │
│   ├── lib/                    # Utility functions
│   │   ├── utils.ts           # General utilities (cn, etc.)
│   │   ├── constants.ts       # App constants
│   │   └── mock-auth.ts       # Mock authentication (Phase 1)
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── index.ts           # Main type exports
│   │   ├── treatment.ts       # Treatment types
│   │   ├── clinic.ts          # Clinic types
│   │   ├── user.ts            # User types
│   │   ├── search.ts          # Search types
│   │   └── i18n.ts            # i18n types
│   │
│   ├── data/                   # Mock data (Phase 1)
│   │   ├── treatments.ts      # Mock treatments
│   │   ├── clinics.ts         # Mock clinics
│   │   ├── users.ts           # Mock users
│   │   └── clinic-treatments.ts # Junction data
│   │
│   ├── styles/
│   │   └── globals.css        # Global styles + Tailwind
│   │
│   ├── i18n.ts                # i18n configuration
│   └── middleware.ts          # Next.js middleware (locale detection)
│
├── public/                     # Static assets
│   └── images/                # Image assets
│
├── .kiro/                      # Kiro specs and configuration
│   └── specs/
│       └── pome-app-migration/ # Migration spec documents
│
├── components.json             # shadcn/ui configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: 18.17 or higher
- **npm**: 9.0 or higher (or yarn/pnpm)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pome-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional for Phase 1)
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript compiler check

# Testing (Future)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🗄️ Phase 2: Database & API

Phase 2 replaces mock data with a real PostgreSQL database using Neon and Prisma ORM. All API routes are now functional with full CRUD operations, validation, and error handling.

### Database Setup

**1. Create a Neon Database**

1. Sign up at [neon.tech](https://neon.tech) (free tier available)
2. Create a new project
3. Copy the connection strings from your Neon dashboard

**2. Configure Environment Variables**

Create a `.env` file in the project root:

```bash
# Copy from .env.example
cp .env.example .env
```

Update the `.env` file with your Neon credentials:

```env
# Neon PostgreSQL (pooled connection for queries)
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# JWT Secret (for Phase 3)
JWT_SECRET="your-secret-key-here"
```

**3. Run Database Migrations**

```bash
# Create database tables
npm run db:migrate

# Generate Prisma Client
npm run db:generate
```

**4. Seed the Database**

```bash
# Populate with sample data
npm run db:seed
```

This creates:
- 3 treatments (Botox, Laser Toning, Rhinoplasty)
- 3 clinics (Gangnam, Apgujeong, Itaewon)
- 5 clinic-treatment relationships
- 1 test user (test@pome.com)

### Database Scripts

```bash
npm run db:migrate   # Run migrations
npm run db:generate  # Generate Prisma Client
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio (database GUI)
```

### API Endpoints

All endpoints are available at `http://localhost:3000/api`

#### Treatments

- **GET** `/api/treatments` - List all treatments
  - Query params: `page`, `limit`, `categories`, `priceMin`, `priceMax`
  - Example: `/api/treatments?page=1&limit=20&categories=anti-aging`

- **GET** `/api/treatments/:id` - Get treatment by ID
  - Returns: Treatment details

- **GET** `/api/treatments/:id/clinics` - Get clinics offering a treatment
  - Returns: Clinics with pricing and availability

#### Clinics

- **GET** `/api/clinics` - List all clinics
  - Query params: `page`, `limit`, `location`, `verified`, `specialties`
  - Example: `/api/clinics?location=Gangnam&verified=true`

- **GET** `/api/clinics/:id` - Get clinic by ID
  - Returns: Clinic details with treatments offered

#### Search

- **GET** `/api/search` - Search treatments and clinics
  - Query params: `q` (required), `limit`
  - Example: `/api/search?q=botox&limit=20`
  - Returns: Matching treatments and clinics

#### Saved Items

- **GET** `/api/saved` - Get user's saved items
  - Returns: Saved treatments and clinics with populated data

- **POST** `/api/saved` - Save a treatment or clinic
  - Body: `{ "itemType": "treatment", "itemId": "xxx", "notes": "..." }`
  - Returns: Created saved item

- **DELETE** `/api/saved/:id` - Remove a saved item
  - Returns: Success message

### API Documentation

**Swagger UI** (Interactive API docs)
- Visit: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Test all endpoints directly in the browser
- View request/response schemas
- See example requests and responses

**Postman Collection**
- Import: `scripts/postman-collection.json`
- Pre-configured with all endpoints
- Environment variable: `{{baseUrl}}` = `http://localhost:3000/api`

### Error Handling

All API routes return consistent error responses:

```json
{
  "error": "Error message",
  "details": {
    // Additional error information
  }
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

### Validation

All API requests are validated using Zod schemas:
- Query parameters are type-checked and coerced
- Request bodies are validated before database operations
- Invalid data returns 400 with detailed error messages

### Database Schema

The Prisma schema includes 5 models:

```prisma
model User {
  id             String      @id @default(cuid())
  email          String      @unique
  passwordHash   String?
  name           String?
  language       String      @default("en")
  savedItems     SavedItem[]
}

model Treatment {
  id           String            @id @default(cuid())
  name         String
  slug         String            @unique
  description  String
  priceMin     Int?
  priceMax     Int?
  categories   String[]
  // ... more fields
}

model Clinic {
  id          String            @id @default(cuid())
  name        String
  slug        String            @unique
  location    String?
  verified    Boolean           @default(false)
  specialties String[]
  // ... more fields
}

model ClinicTreatment {
  id          String   @id @default(cuid())
  clinicId    String
  treatmentId String
  price       Int?
  availability String  @default("available")
  // ... relations
}

model SavedItem {
  id       String   @id @default(cuid())
  userId   String
  itemType String
  itemId   String
  notes    String?
  // ... relations
}
```

### Testing the API

**Using Swagger UI:**
1. Start the dev server: `npm run dev`
2. Visit: http://localhost:3000/api/docs
3. Click "Try it out" on any endpoint
4. Fill in parameters and execute

**Using Postman:**
1. Import `scripts/postman-collection.json`
2. Set `{{baseUrl}}` to `http://localhost:3000/api`
3. Run requests from the collection

**Using curl:**
```bash
# List treatments
curl http://localhost:3000/api/treatments

# Get treatment by ID
curl http://localhost:3000/api/treatments/[id]

# Search
curl "http://localhost:3000/api/search?q=botox"

# Create saved item
curl -X POST http://localhost:3000/api/saved \
  -H "Content-Type: application/json" \
  -d '{"itemType":"treatment","itemId":"xxx"}'
```

## 🌍 Internationalization (i18n)

### Current Implementation

The application uses `next-intl` for internationalization with full support for:
- **English (en)**: Complete translations ✅
- **Korean (ko)**: Placeholder (Phase 4)
- **Chinese (zh)**: Placeholder (Phase 4)
- **Japanese (ja)**: Placeholder (Phase 4)

### Using Translations in Components

**Server Components:**
```tsx
import { useTranslations } from 'next-intl';

export default function MyPage() {
  const t = useTranslations('home');
  return <h1>{t('title')}</h1>;
}
```

**Client Components:**
```tsx
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('common');
  return <button>{t('save')}</button>;
}
```

### Translation File Structure

Translation keys are organized by feature:
- `common`: Shared UI elements (save, cancel, loading, etc.)
- `nav`: Navigation labels
- `home`: Homepage content
- `auth`: Authentication forms
- `treatments`: Treatment pages
- `clinics`: Clinic pages
- `profile`: Profile page
- `search`: Search functionality
- `saved`: Saved items page
- `validation`: Form validation messages

### Adding New Translations

1. Add keys to `messages/en.json`
2. Use the key in your component: `t('yourKey')`
3. For future languages, add translations to `ko.json`, `zh.json`, `ja.json`

See `messages/TRANSLATION_WORKFLOW.md` for detailed guidelines.

## 🔐 Authentication (Phase 3)

Phase 3 implements real authentication using NextAuth.js with support for both email/password and Google OAuth.

### Authentication Methods

**1. Email/Password Authentication**
- User registration with email and password
- Secure password hashing with bcryptjs
- Email verification system
- Password reset functionality

**2. Google OAuth** ⭐ NEW!
- One-click sign-in with Google
- Automatic account linking (same email)
- Profile picture sync
- No password required

### Google OAuth Setup

To enable Google OAuth authentication, you need to configure Google Cloud Console credentials.

**Step 1: Create OAuth Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Choose **Web application**
6. Configure:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`

**Step 2: Configure Environment Variables**

Add to your `.env` file:

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

**Step 3: Run Database Migration** (if not already done)

```bash
npm run db:migrate
```

**For detailed setup instructions**, see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

### Test Credentials

**Email/Password:**
```
Email: test@pome.com
Password: password123
```

Other test accounts:
- `sarah.kim@example.com` / `password123`
- `john.park@example.com` / `password123`

**Google OAuth:**
- Use any Google account to sign in
- First sign-in creates a new user
- Subsequent sign-ins link to existing account (if email matches)

### Account Linking

The system automatically links Google accounts to existing email/password accounts:

1. **User registers with email/password** → Account created
2. **User signs in with Google (same email)** → Google account linked
3. **User can now sign in with BOTH methods** ✅

**Note**: If you sign up with Google first, you cannot add a password later (Google-only account).

### Using Authentication

```tsx
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Check if user is logged in
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <div>Welcome, {user?.name}!</div>;
}
```

### Protected Routes

Routes that require authentication:
- `/saved` - Saved items page
- `/profile` - User profile page

Public routes:
- `/` - Homepage
- `/treatments` - Treatment list
- `/treatments/[id]` - Treatment detail
- `/clinics` - Clinic list
- `/clinics/[id]` - Clinic detail
- `/search` - Search results
- `/login` - Login page
- `/register` - Registration page

### Troubleshooting

**"redirect_uri_mismatch" Error:**
- Check that redirect URI in Google Console is exactly: `http://localhost:3000/api/auth/callback/google`
- No trailing slash!

**"invalid_client" Error:**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- No extra spaces or quotes
- Restart dev server after changing `.env`

**User Not Created:**
- Check server console for errors
- Verify database connection
- Run `npm run db:studio` to inspect database

**For more troubleshooting**, see [GOOGLE_OAUTH_TESTING_PLAN.md](./GOOGLE_OAUTH_TESTING_PLAN.md)

## 🎨 Styling and Theming

### Tailwind Configuration

The application uses a custom Tailwind configuration with:
- Custom color palette (primary: #D90429)
- Dark mode support
- Custom border radius values
- Responsive breakpoints

### Dark Mode

Dark mode is implemented using `next-themes`:
```tsx
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

### shadcn/ui Components

All UI components are from shadcn/ui and can be customized in `src/components/ui/`.

To add new components:
```bash
npx shadcn-ui@latest add [component-name]
```

## 📱 Responsive Design

The application follows a mobile-first approach:
- **Mobile**: < 640px (single column, bottom navigation)
- **Tablet**: 640px - 1024px (2 columns, bottom navigation)
- **Desktop**: > 1024px (multi-column, no bottom navigation)

## 🧪 Testing (Future Phase)

Testing infrastructure will be added in Phase 2:
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Playwright
- Integration tests for API routes

## 📊 Development Phases

### ✅ Phase 1: UI/UX Migration (Complete)
- Next.js App Router with TypeScript
- shadcn/ui component library
- Mock data implementation
- All pages with visual parity
- Responsive design
- Dark mode support
- i18n infrastructure with English
- Mock authentication
- Mock saved items functionality

### ✅ Phase 2: Database Integration (Complete)
- Neon PostgreSQL setup
- Prisma ORM configuration
- Database schema implementation
- API routes for data fetching
- Replace mock data with real database queries
- Full CRUD operations
- Validation and error handling

### ✅ Phase 3: Authentication (Complete)
- NextAuth.js integration
- JWT session strategy
- Email/Password authentication
- **Google OAuth integration** ⭐
- User registration
- Password reset functionality
- Email verification system
- Account linking (Google ↔ Email/Password)
- Profile picture sync from Google

### 🔜 Phase 4: Additional OAuth Providers
- Kakao OAuth (popular in Korea)
- Naver OAuth (popular in Korea)
- Account management UI
- Multi-provider linking

### 🔜 Phase 5: Internationalization Expansion
- Professional Korean translations
- Chinese translations
- Japanese translations
- Translation management workflow

### 🔜 Phase 6: Advanced Features
- Real-time search with Algolia/Meilisearch
- User reviews and ratings
- Clinic booking system
- Email notifications
- Admin dashboard
- Redis for rate limiting (production)

## 🔧 Phase 2 Preparation

### Database Schema (Prisma)

TypeScript interfaces in Phase 1 are designed to match the future Prisma schema:

```prisma
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  password_hash     String
  name              String
  languagePreference String  @default("en")
  createdAt         DateTime @default(now())
  savedItems        SavedItem[]
}

model Treatment {
  id              String   @id @default(cuid())
  name            String
  description     String
  icon            String
  priceRangeMin   Int
  priceRangeMax   Int
  currency        String
  duration        String
  recoveryTime    String
  risks           String[]
  categories      String[]
  clinics         ClinicTreatment[]
}

model Clinic {
  id           String   @id @default(cuid())
  name         String
  location     String
  description  String
  imageUrl     String
  rating       Float
  reviewCount  Int?
  specialties  String[]
  verified     Boolean  @default(false)
  treatments   ClinicTreatment[]
}

model ClinicTreatment {
  clinicId     String
  treatmentId  String
  price        Int?
  availability String
  clinic       Clinic    @relation(fields: [clinicId], references: [id])
  treatment    Treatment @relation(fields: [treatmentId], references: [id])
  @@id([clinicId, treatmentId])
}

model SavedItem {
  id        String   @id @default(cuid())
  userId    String
  itemType  String
  itemId    String
  savedAt   DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

### API Routes to Implement

Phase 2 will add these API routes:
- `GET /api/treatments` - List treatments with filters
- `GET /api/treatments/[id]` - Get treatment details
- `GET /api/clinics` - List clinics with filters
- `GET /api/clinics/[id]` - Get clinic details
- `GET /api/search` - Search treatments and clinics
- `POST /api/saved` - Save an item
- `DELETE /api/saved/[id]` - Remove saved item
- `GET /api/saved` - Get user's saved items

### Mock Data Replacement

Current mock data locations that will be replaced:
- `src/data/treatments.ts` → API calls to `/api/treatments`
- `src/data/clinics.ts` → API calls to `/api/clinics`
- `src/data/users.ts` → NextAuth session management
- `src/lib/mock-auth.ts` → NextAuth.js authentication

## 🤝 Contributing

### Code Style

- Use TypeScript strict mode (no `any` types)
- Follow ESLint and Prettier configurations
- Write JSDoc comments for all components and functions
- Use translation keys for all user-facing text
- Follow the existing component structure

### Component Guidelines

1. **Server Components by default**: Use Server Components unless you need client-side interactivity
2. **Client Components**: Add `'use client'` directive only when needed
3. **Props documentation**: Always document props with JSDoc
4. **Translation keys**: Never hardcode user-facing strings
5. **Responsive design**: Test on mobile, tablet, and desktop
6. **Accessibility**: Ensure proper ARIA labels and keyboard navigation

### Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and type checking
4. Commit with descriptive messages
5. Create a pull request

## 📝 License

ISC

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization library

---

**Built with ❤️ for the beauty and wellness community in Korea**
