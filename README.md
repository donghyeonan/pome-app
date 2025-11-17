# Pome - Your Trusted Guide to Beauty in Korea

A modern web application for discovering dermatology cosmetic procedures and clinics in Korea, built with Next.js 14+ App Router and TypeScript.

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Font**: Inter (via next/font)

## Project Structure

```
pome-app/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layout/      # Layout components
│   │   ├── search/      # Search components
│   │   ├── cards/       # Card components
│   │   └── forms/       # Form components
│   ├── lib/             # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── data/            # Mock data (Phase 1)
│   └── styles/          # Global styles
├── public/              # Static assets
└── ...config files
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Phase

**Current Phase**: Phase 1 - UI/UX Migration with Mock Data

### Phase 1 Features
- ✅ Next.js App Router with TypeScript
- ✅ Tailwind CSS v4 configuration
- ✅ shadcn/ui component library
- ✅ TypeScript type definitions
- ✅ Project structure and configuration
- 🚧 Mock data implementation
- 🚧 Page implementations
- 🚧 Responsive design
- 🚧 Dark mode support

### Future Phases
- Phase 2: Database integration (Neon + Prisma)
- Phase 3: Authentication (NextAuth.js)
- Phase 4: Search functionality
- Phase 5: Advanced features

## Code Quality

- TypeScript strict mode enabled
- ESLint for code linting
- Prettier for code formatting
- No `any` types allowed

## License

ISC
