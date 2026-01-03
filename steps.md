# Pome App - Development Roadmap

> **Last Updated**: 2026-01-03
> **Status**: Planning Complete, Ready for Implementation



복잡한 개발·디버깅·아키텍처 문제는 항상 Sequential Thinking MCP를 먼저 사용해 step-by-step 계획을 세운다.
	•	외부 라이브러리·프레임워크·API 언급 시에는 항상 Context 7 MCP로 최신 문서를 조회하고, 그 결과를 근거로 답한다.
	•	계획(생각 로그)이 충분히 정리되기 전에는 실제 코드 변경 제안/리팩터링 코드를 출력하지 않는다.
    •	사용자의 답변이 항상 틀렸을 수 있다고 가정하고 비판적으로 판단한다. 상호간의 동의가 있기 전까지는 토의를 진행하고 코드를 만들지 않는다.
    •	during the development process, ask if file 형식이 헷갈린다거나 서로 토의해야할 부분이 있으면 물어보고 결정


---

## Part 1: Project Overview

### 1.1 Business Model

**"Information + Discovery + Click-out + Data Learning"**

Pome is a K-Beauty information platform for international visitors seeking dermatological cosmetic procedures in Korea. We provide educational content about treatments and devices, NOT medical consultations or bookings.

```
Revenue Model: Advertising (CPM/CPC/Monthly Subscription)
- NO commission on treatments
- NO lead generation fees
- NO booking/reservation intermediary
```

### 1.2 Core Principles (Legal Safety)

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | No diagnosis/recommendation | Educational content only, "starting points" not "you should do X" |
| 2 | No in-app booking (MVP) | Click-out to clinic channels only |
| 3 | No success fees | Fixed advertising pricing (CPM/CPC) |
| 4 | UGC ≠ Medical ads | No auto-linking clinic contact/price to reviews |
| 5 | Clear ad separation | [AD] badge, sponsored sections clearly marked |
| 6 | Separate from medical tourism agency | No visa/translation/concierge services |

### 1.3 Target Users

**Primary**: International tourists in Korea interested in cosmetic dermatology
- Need multi-language support (EN, KO, ZH, JA)
- Want to understand treatments before visiting clinics
- Value peer experiences from similar skin types/ethnicities

**Secondary**: Clinics seeking international patients
- Want targeted advertising to high-intent users
- Need performance data (impressions, clicks, click-outs)

### 1.4 Key User Flows

```
[Onboarding] → [Home Feed] → [Treatment Detail] → [Device Compare]
                    ↓                                    ↓
              [Ad Click] → [/r/{token}] → [External Handoff]
                    ↓
              [Community] → [Cohort Threads]
```

---

## Part 2: Tech Stack

### 2.1 Confirmed Stack

| Layer | Technology | Version/Notes |
|-------|------------|---------------|
| **Framework** | Next.js (App Router) | 16.x |
| **Language** | TypeScript | 5.x strict mode |
| **UI Runtime** | React | 19.x |
| **Styling** | Tailwind CSS | v4 |
| **Components** | shadcn/ui + Radix UI | |
| **Icons** | Lucide React | |
| **Theme** | next-themes | dark mode |
| **i18n** | next-intl | en, ko, zh, ja |
| **Database** | Neon PostgreSQL | Serverless |
| **ORM** | Prisma | 6.x |
| **Auth** | NextAuth.js | v4.24.13 (pinned) + Credentials + Google |
| **Password** | bcryptjs | 10 rounds |
| **Validation** | Zod | 4.x |
| **Email** | Resend | |
| **Hosting** | Vercel | |
| **Cache/Rate Limit** | Upstash Redis | click token TTL + rate limit |
| **Analytics** | PostHog | events + funnels |

### 2.2 Auth Strategy (Final)

**Choice**: **NextAuth.js v4 (stable)**, pinned to a known-good version.

**Why**
- v4 is the current stable line on npm; v5/Auth.js docs are still positioned as beta.
- You already need Credentials + Google; v4 is lowest-risk for MVP.
- Next.js 16 can surface peer-dependency friction; reduce moving parts early.

**Practical note (Next.js 16 peer-deps)**
- If install is blocked by peer-dependency checks, use a repo-scoped workaround:
  - **pnpm**: set `strict-peer-dependencies=false` (project-only)  
  - **npm**: set `legacy-peer-deps=true` (project-only)
- Revisit Auth.js v5 only when it reaches GA and explicitly supports Next.js 16 without workarounds.

**(Phase 0 check)** confirm `next-auth@4.24.13` installs cleanly in CI and auth flows work on App Router.

### 2.3 Architecture Pattern


```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  Pages (Server) → Components (Client) → Hooks               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│  API Routes (/api/v1/*) → Server Actions → Queries          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Business Logic                           │
│  Services (complex logic only: ads, auth, moderation)       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  Prisma (Neon) │ Redis (Upstash) │ PostHog │ Resend        │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 3: Data Model

### 3.1 Entity Relationship

```
Treatment (시술)
    │
    ├── goalTags[]      # 고민/목표 (다중)
    ├── modalityTags[]  # 방식/기술 (다중, PEEL 포함)
    ├── areaTags[]      # 부위 (다중)
    │
    ├──→ TreatmentDevice ←── Device (장비)
    │    • role: primary | alternative | add-on
    │    • positioning: ["FasterRecovery", "StrongerEffect"]
    │    • pros, cons, skinTypeCautions
    │
    ├──→ ClinicTreatment ←── Clinic (병원)
    │                            │
    │                            └──→ ClinicDevice (보유 장비)
    │
    ├──→ TreatmentI18n (번역)
    │
    └──→ Thread (커뮤니티)
              │
              └──→ Post

User
    │
    ├──→ UserProfile (skinType, ethnicity, interests)
    │
    ├──→ QuizSession (퀴즈 결과 연결)
    │
    └──→ SavedItem

Campaign (광고)
    │
    └──→ AdCreative (소재)
              │
              └──→ AdEvent (노출/클릭/클릭아웃)
```

### 3.2 Key Models (Prisma Schema Overview)

#### Shared Enums (Fixed Vocabulary)

```prisma
enum TierLevel {
  NONE
  MINIMAL
  MILD
  MODERATE
  SIGNIFICANT
  STRONG
}

enum TreatmentDeviceRole {
  PRIMARY
  ALTERNATIVE
  ADD_ON
}

enum DeviceCategory {
  PICO
  FRACTIONAL
  RF
  HIFU
  IPL
  LED
  MICRONEEDLING
  BODY_DEVICE
  OTHER
}
```

#### Treatment (시술)

```prisma
model Treatment {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String?

  // Canonical tagging (multi-axis)
  goalTags      String[] // e.g. ["LIFTING","PORES"]
  modalityTags  String[] // e.g. ["RF","HIFU","PEEL"]
  areaTags      String[] // e.g. ["FACE","NECK"]

  // Quick facts
  downtimeTier    TierLevel @default(NONE)
  painTier        TierLevel @default(NONE)
  sessionsTier    String?
  durationMinutes Int?

  // Educational copy (non-medical)
  suitableFor     String[]
  cautions        String[]

  imageUrl        String?

  // Relations
  devices   TreatmentDevice[]
  clinics   ClinicTreatment[]
  threads   Thread[]
  i18n      TreatmentI18n[]
}
```

#### Device (장비)

```prisma
model Device {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  maker       String
  category    DeviceCategory

  wavelengths     String[]
  mechanism       String?
  imageUrl        String?

  treatments      TreatmentDevice[]
  clinics         ClinicDevice[]
  i18n            DeviceI18n[]
}
```

#### TreatmentDevice (핵심 조인)

```prisma
model TreatmentDevice {
  id            String   @id @default(cuid())
  treatmentId   String
  deviceId      String

  role          TreatmentDeviceRole @default(PRIMARY)
  positioning   String[]            // fixed vocabulary tags
  pros          String[]
  cons          String[]

  // When this device is used for this treatment, what is it best for?
  bestForGoalTags   String[]        // e.g. ["LIFTING","PORES"]

  // Optional overrides per pairing
  downtimeTier      TierLevel?
  effectTier        TierLevel?

  skinTypeCautions  String[]        // educational cautions

  sortOrder     Int @default(0)

  treatment     Treatment @relation(fields: [treatmentId], references: [id], onDelete: Cascade)
  device        Device    @relation(fields: [deviceId], references: [id], onDelete: Cascade)

  @@unique([treatmentId, deviceId])
  @@index([treatmentId])
  @@index([deviceId])
}
```

#### QuizSession (마케팅 퀴즈)

```prisma
model QuizSession {
  id          String   @id @default(cuid())

  answers     Json     // { q1: "A", q2: "B", ... }
  resultTags  String[] // ["gentle", "no-downtime", "texture"]
  locale      String

  userId      String?  // 가입 후 연결
  user        User?    @relation(...)

  expiresAt   DateTime // TTL 30일
  createdAt   DateTime @default(now())
}
```

#### i18n Tables

```prisma
model TreatmentI18n {
  id          String @id @default(cuid())
  treatmentId String
  locale      String // "ko" | "zh" | "ja"

  name        String
  summary     String?
  description String?

  treatment   Treatment @relation(...)

  @@unique([treatmentId, locale])
}

model DeviceI18n {
  id       String @id @default(cuid())
  deviceId String
  locale   String

  name     String
  summary  String?

  device   Device @relation(...)

  @@unique([deviceId, locale])
}
```

### 3.3 Positioning Tags (Fixed Vocabulary)

```typescript
const POSITIONING_TAGS = [
  "FasterRecovery",    // 빠른 회복
  "StrongerEffect",    // 강한 효과
  "Gentler",           // 순한/자극 적음
  "LessDowntime",      // 다운타임 적음
  "MoreDowntime",      // 다운타임 있음
  "BestForTexture",    // 피부결 개선
  "BestForPigment",    // 색소 개선
  "BestForLifting",    // 리프팅
  "SensitiveSkinOK",   // 민감 피부 적합
  "DeepTreatment",     // 깊은 치료
] as const;
```

### 3.4 Taxonomy (Fixed Tag Sets)

> These are **UI + analytics primitives**. They are not medical classifications.
> **PEEL** is represented here (modality), **not** as a device category.
> **TIGHTENING은 LIFTING으로 통합** (처짐/탄력을 하나의 goal로 관리)

```ts
// lib/constants/taxonomy.ts

export const GOAL_TAGS = [
  "LIFTING",           // 처짐 + 탄력 (TIGHTENING 통합)
  "PORES",             // 모공
  "TEXTURE",           // 피부결
  "PIGMENT",           // 색소 (기미, 잡티)
  "ACNE_SCARS",        // 여드름 흉터
  "WRINKLES",          // 주름
  "HYDRATION_GLOW",    // 수분/광채
  "REDNESS_VASCULAR",  // 홍조/혈관
  "BODY_CONTOURING",   // 바디 윤곽
  "HAIR_REMOVAL",      // 제모 (MVP에 포함, NAV는 나중에)
] as const;  // 10개

export const MODALITY_TAGS = [
  "RF",            // 고주파
  "HIFU",          // 초음파
  "PICO",          // 피코 레이저
  "FRACTIONAL",    // 프락셔널
  "IPL",           // 광선
  "LED",           // LED
  "MICRONEEDLING", // 마이크로니들
  "INJECTABLE",    // 보톡스, 필러
  "THREAD",        // 실리프팅
  "PEEL",          // 필링 (장비 아님, 시술 방식)
  "SKINCARE",      // 스킨케어 시술
  "OTHER",
] as const;  // 12개

export const AREA_TAGS = [
  "FACE",   // 얼굴 전체
  "NECK",   // 목
  "EYES",   // 눈가
  "NOSE",   // 코
  "BODY",   // 바디
  "SCALP",  // 두피
] as const;  // 6개

// TypeScript types
export type GoalTag = typeof GOAL_TAGS[number];
export type ModalityTag = typeof MODALITY_TAGS[number];
export type AreaTag = typeof AREA_TAGS[number];
```

### 3.5 Zod Validators (Server-side)

> **파일 분리 원칙**: constants는 클라/서버 공용, validations는 서버 전용
> → 클라이언트 번들 오염 방지

```ts
// lib/validations/taxonomy.ts

import { z } from 'zod';
import { GOAL_TAGS, MODALITY_TAGS, AREA_TAGS, POSITIONING_TAGS } from '@/lib/constants/taxonomy';

// Single tag validators
export const goalTagSchema = z.enum(GOAL_TAGS);
export const modalityTagSchema = z.enum(MODALITY_TAGS);
export const areaTagSchema = z.enum(AREA_TAGS);
export const positioningTagSchema = z.enum(POSITIONING_TAGS);

// Array validators (for DB fields)
export const goalTagsArraySchema = z.array(goalTagSchema);
export const modalityTagsArraySchema = z.array(modalityTagSchema);
export const areaTagsArraySchema = z.array(areaTagSchema);
export const positioningTagsArraySchema = z.array(positioningTagSchema);

// Treatment create/update validation
export const treatmentTagsSchema = z.object({
  goalTags: goalTagsArraySchema.min(1, "At least one goal required"),
  modalityTags: modalityTagsArraySchema.optional(),
  areaTags: areaTagsArraySchema.optional(),
});
```

**사용처:**
- `POST /api/v1/events` (goal/modality/area 프로퍼티 검증)
- Onboarding 관심사 저장
- Quiz resultTags 저장
- Seed import 스크립트 (데이터 오염 원천 차단)

### 3.6 Navigation Groups (Config Layer)

> **핵심 원칙**: DB에는 goal/modality/area 태그만 저장하고,
> UI 네비게이션(리프팅/피부/색소...)은 **config 레이어**로 운영.
> → 메뉴 구성 변경 시 DB 마이그레이션 불필요

```ts
// config/nav-groups.ts

// DSL 형태로 정의 (Prisma 의존성 없음 → 클라이언트에서도 안전하게 import 가능)
export const NAV_GROUPS = {
  lifting: {
    label: { en: "Lifting", ko: "리프팅" },
    goals: ["LIFTING"],
    modalities: ["RF", "HIFU", "THREAD"],  // OR 조건
    areas: [],
  },
  skin: {
    label: { en: "Skin", ko: "피부" },
    goals: ["TEXTURE", "PORES", "HYDRATION_GLOW", "REDNESS_VASCULAR"],
    modalities: [],
    areas: [],
  },
  pigment: {
    label: { en: "Pigment", ko: "색소" },
    goals: ["PIGMENT"],
    modalities: [],
    areas: [],
  },
  acne_scars: {
    label: { en: "Acne Scars", ko: "여드름 흉터" },
    goals: ["ACNE_SCARS"],
    modalities: [],
    areas: [],
  },
  wrinkles: {
    label: { en: "Wrinkles", ko: "주름" },
    goals: ["WRINKLES"],
    modalities: [],
    areas: [],
  },
  body: {
    label: { en: "Body", ko: "바디" },
    goals: ["BODY_CONTOURING"],
    modalities: [],
    areas: ["BODY"],  // OR 조건
  },
} as const;

export type NavGroupKey = keyof typeof NAV_GROUPS;
export type NavGroup = typeof NAV_GROUPS[NavGroupKey];
```

```ts
// lib/db/queries/treatments.ts

import { NAV_GROUPS, NavGroupKey } from '@/config/nav-groups';
import { Prisma } from '@prisma/client';

// DSL → Prisma where 변환 함수
export function navGroupToPrismaWhere(key: NavGroupKey): Prisma.TreatmentWhereInput {
  const group = NAV_GROUPS[key];
  const conditions: Prisma.TreatmentWhereInput[] = [];

  if (group.goals.length > 0) {
    conditions.push({ goalTags: { hasSome: group.goals } });
  }
  if (group.modalities.length > 0) {
    conditions.push({ modalityTags: { hasSome: group.modalities } });
  }
  if (group.areas.length > 0) {
    conditions.push({ areaTags: { hasSome: group.areas } });
  }

  return conditions.length > 1 ? { OR: conditions } : conditions[0] ?? {};
}

// 사용 예시
// GET /api/v1/treatments?navGroup=lifting
const treatments = await prisma.treatment.findMany({
  where: navGroupToPrismaWhere('lifting'),
});
```

**장점:**
- **클라이언트 안전**: NAV_GROUPS는 순수 데이터, Prisma 의존성 없음
- **서버 최적화**: `navGroupToPrismaWhere()`에서 Prisma where로 변환
- 메뉴 추가/삭제/순서 변경 → 코드만 수정, DB 변경 없음
- A/B 테스트 (다른 메뉴 구성 실험) 용이
- 이벤트에 `navGroup` 프로퍼티 추가하면 전환 분석 가능

---

## Part 4: UI/UX Design

### 4.1 Route Structure

```
/[locale]/
├── (public)/                     # SEO/유입
│   ├── page.tsx                  # 홈 피드
│   ├── treatments/
│   │   ├── page.tsx              # 시술 목록
│   │   └── [slug]/page.tsx       # 시술 상세 + Device 비교
│   ├── devices/
│   │   └── [slug]/page.tsx       # 장비 상세 (선택적)
│   ├── clinics/
│   │   ├── page.tsx              # 클리닉 목록 (비의료 필터)
│   │   └── [slug]/page.tsx       # 클리닉 상세
│   ├── search/page.tsx           # 통합 검색
│   ├── quiz/page.tsx             # Beauty Passport Quiz (공개)
│   └── community/
│       ├── page.tsx              # 코호트 목록
│       ├── [cohort]/page.tsx     # 코호트별 피드
│       └── post/[id]/page.tsx    # 글 상세
│
├── (auth)/
│   ├── login/
│   ├── register/
│   └── onboarding/               # 피부타입, 관심사 (퀴즈 결과 연결)
│
├── (protected)/
│   ├── saved/
│   ├── profile/
│   └── settings/
│
├── dashboard/                    # 병원 대시보드 (별도 레이아웃)
│   ├── page.tsx
│   ├── campaigns/
│   ├── creatives/
│   └── reports/
│
├── r/[token]/route.ts            # 클릭아웃 리디렉트
│
└── api/v1/                       # 버전화된 API
    ├── treatments/
    ├── devices/
    ├── clinics/
    ├── ads/decision/
    ├── events/
    ├── quiz/
    ├── threads/
    └── posts/
```

### 4.2 Home Screen Layout

```
┌─────────────────────────────────────┐
│ Pome              🔍    🔔          │  Header (fixed)
├─────────────────────────────────────┤
│ [Context Banner - 위치 권한 시]      │
│ "📍 Gangnam · Afternoon"            │
│ "Quick treatments nearby"           │
├─────────────────────────────────────┤
│ 🔍 Search treatments, devices...    │  Search bar (sticky)
├─────────────────────────────────────┤
│ [All] [Laser] [Injectables] [Skin]  │  Category chips
├─────────────────────────────────────┤
│ Popular Treatments                  │
│ ┌─────────┐ ┌─────────┐            │
│ │ Pico    │ │ Lifting │            │  Treatment cards
│ │ ⏱15min  │ │ ⏱30min  │            │
│ └─────────┘ └─────────┘            │
├─────────────────────────────────────┤
│ [AD] Featured Clinic                │  광고 슬롯 (1개 고정)
│ ┌─────────────────────────────────┐ │
│ │ ABC Dermatology · Gangnam       │ │
│ │ "Pico specialist" [Visit →]     │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 💬 Community                        │
│ "Dark skin laser experiences"       │  경험 중심 톤
│ "Glass skin routine discussion"     │
├─────────────────────────────────────┤
│ 🏠    🔍    🏥    💬    👤          │  Bottom nav (fixed)
│ Home Search Clinics Community Profile
└─────────────────────────────────────┘
```

### 4.3 Treatment Detail Page

```
┌─────────────────────────────────────┐
│ ← Back              Laser Resurfacing│
├─────────────────────────────────────┤
│ [Hero Image - 30-40vh, 스크롤 시 축소]│
│ "Smooths texture, reduces scars"    │
├─────────────────────────────────────┤
│ ⏱ Quick Facts                       │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│ │15m │ │None│ │Mild│ │2-4x│       │
│ │Time│ │Down│ │Pain│ │Sess│       │
│ └────┘ └────┘ └────┘ └────┘       │
├─────────────────────────────────────┤
│ 👤 Who it's for                     │
│ • Acne scars, uneven texture        │
│ • ⚠️ Darker skin: discuss settings  │
├─────────────────────────────────────┤
│ 🔬 Devices Used        [Compare All]│
│ ┌─────────────────────────────────┐ │
│ │ PicoSure                        │ │
│ │ ✓ Fast recovery · Gentle        │ │
│ │ Best for: sensitive skin        │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Fraxel                          │ │
│ │ ✓ Strong effect · More downtime │ │
│ │ Best for: deep scars            │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ❓ Questions to Ask Your Clinic     │
│ □ "Is this device genuine?"        │
│ □ "What settings for my skin?"     │
│ □ "Expected recovery timeline?"    │
├─────────────────────────────────────┤
│ 💬 Related Discussions              │
│ [Thread previews]                   │
├─────────────────────────────────────┤
│ [AD] Clinics offering this          │
│ ┌─────────────────────────────────┐ │
│ │ [AD] Seoul Skin Clinic          │ │
│ │ Gangnam · English OK            │ │
│ │ [Visit Website →]               │ │  ← 클릭아웃
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 4.4 Device Compare Modal

```
┌─────────────────────────────────────┐
│ Compare Devices        [X Close]    │
├─────────────────────────────────────┤
│         │ PicoSure   │ Fraxel      │
├─────────────────────────────────────┤
│ Recovery│ ●○○ Fast   │ ●●● Longer  │
│ Effect  │ ●●○ Medium │ ●●● Strong  │
│ Pain    │ ●○○ Mild   │ ●●○ Moderate│
├─────────────────────────────────────┤
│ Best for│ Sensitive  │ Deep scars  │
│         │ skin, mild │ aggressive  │
│         │ concerns   │ treatment   │
├─────────────────────────────────────┤
│ ⚠️ Note for darker skin tones:      │
│ "Both require careful settings..."  │
└─────────────────────────────────────┘
```

### 4.5 Beauty Passport Quiz Flow

```
Step 1: A/B Card Selection (6-10 questions)
┌─────────────────────────────────────┐
│ Which is more you?                  │
│                                     │
│ ┌───────────┐  ┌───────────┐       │
│ │     A     │  │     B     │       │
│ │  0-1 day  │  │  Don't    │       │
│ │ downtime  │  │   mind    │       │
│ └───────────┘  └───────────┘       │
│                                     │
│ [2/6] ●●○○○○                        │
└─────────────────────────────────────┘

Step 2: Result (NOT diagnosis)
┌─────────────────────────────────────┐
│ Your Beauty Passport                │
│                                     │
│ 🎯 Starting Points for You          │
│ • Gentle resurfacing                │
│ • No-downtime options               │
│ • Texture-focused treatments        │
│                                     │
│ 🔬 Devices to Explore               │
│ PicoSure, Gentle RF, LED            │
│                                     │
│ ❓ Questions to Bring               │
│ □ "Settings for sensitive skin?"   │
│                                     │
│ [Share Result 📤]                   │
│ [Explore in App →]                  │  ← 앱 설치/딥링크
│                                     │
│ ⚠️ This is educational content,     │
│    not medical advice.              │
└─────────────────────────────────────┘
```

---

## Part 5: API Design

### 5.1 Core Endpoints

#### Content APIs

```
GET  /api/v1/treatments
GET  /api/v1/treatments/{slug}
GET  /api/v1/treatments/{slug}/devices    # Device 비교용
GET  /api/v1/devices
GET  /api/v1/devices/{slug}
GET  /api/v1/clinics
GET  /api/v1/clinics/{slug}
GET  /api/v1/search?q=&type=
```

#### Quiz API

```
POST /api/v1/quiz/sessions              # 퀴즈 시작
PUT  /api/v1/quiz/sessions/{id}         # 답변 저장
GET  /api/v1/quiz/sessions/{id}/result  # 결과 조회
POST /api/v1/quiz/sessions/{id}/link    # 유저 연결 (가입 후)
```

#### Ad Decision API

```
POST /api/v1/ads/decision
Request:
{
  placement: "home_feed" | "treatment_detail" | "search_results",
  slots: 1,
  context: {
    anonId: "anon_abc",   // stable anonymous id
    userId?: "usr_123",   // if logged in
    locale: "en",
    geohash?: "wydm9",
    treatmentId?: "xxx",
  }
}

Response:
{
  ads: [{
    creativeId: "xxx",
    campaignId: "xxx",
    headline: "Pico Specialist",
    imageUrl: "...",
    clickToken: "ct_123",     // randomId stored in Redis/DB (TTL)
    clickoutUrl: "/r/ct_123"
  }]
}
```

#### Click-out Redirect

```
GET /r/{token}

1. Lookup token in Redis/DB (TTL)
2. Log clickout event (PostHog + DB)
3. 302 Redirect to destination URL

If token is missing/expired: return a lightweight “link expired” page (no redirect).
   - web: https://clinic.com
   - kakao: https://pf.kakao.com/...
   - whatsapp: https://wa.me/...
   - tel: tel:+82...
```

#### Events API

```
POST /api/v1/events
{
  events: [{
    eventId: "evt_123",      // client-generated UUID (dedupe)
    anonId: "anon_abc",      // stable anonymous id (pre-login)
    sessionId: "sess_xyz",   // optional
    type: "content_view" | "ad_impression" | "ad_click" | "search" | ...,
    timestamp: "2025-01-03T10:00:00Z",
    properties: {
      treatmentId?: "xxx",
      deviceId?: "xxx",
      campaignId?: "xxx",
      query?: "pico laser",
      dwellMs?: 5000,
    }
  }]
}
```

#### Community APIs

```
GET  /api/v1/threads?cohort=ethnicity&value=east-asian
GET  /api/v1/posts?threadId=xxx&sort=hot
POST /api/v1/posts
POST /api/v1/posts/{id}/upvote
POST /api/v1/reports                    # 신고
```

### 5.2 Event Taxonomy

| Event | Properties | Trigger |
|-------|------------|---------|
| `content_view` | treatmentId, deviceId, dwellMs | 페이지 뷰 |
| `device_compare_open` | treatmentId, deviceIds[] | 비교 모달 열기 |
| `device_compare_select` | treatmentId, deviceId | 비교에서 선택 |
| `ad_impression` | campaignId, creativeId, placement | 광고 노출 |
| `ad_click` | campaignId, creativeId | 광고 클릭 |
| `clickout` | campaignId, destinationType | /r/token 통과 |
| `search` | query, filters, resultsCount | 검색 |
| `quiz_start` | - | 퀴즈 시작 |
| `quiz_complete` | resultTags[] | 퀴즈 완료 |
| `community_view` | threadId, postId | 커뮤니티 조회 |
| `post_create` | threadId | 글 작성 |

---

## Part 6: Development Phases

### Phase 0: Foundation Refactoring

**Goal**: Clean up existing code, establish new architecture patterns

**Duration**: ~1 week

#### Tasks

- [x] **0.1 Query Functions Pattern** ✅
  - [x] Create `lib/db/queries/` directory
  - [x] Extract `treatments.ts` - getTreatments, getTreatmentBySlug
  - [x] Extract `clinics.ts` - getClinics, getClinicBySlug
  - [x] Extract `users.ts` - getUserById, getUserByEmail
  - [x] Update existing API routes to use queries

- [x] **0.2 Remove Mock Data Dependencies** ✅
  - [x] Update `treatments/page.tsx` to Server Component + TreatmentsClient.tsx
  - [x] Update `clinics/page.tsx` to Server Component + ClinicsClient.tsx
  - [x] Update `search/page.tsx` to Server Component + SearchClient.tsx
  - [ ] Deprecate `/data/` folder (keep for reference) - 미사용 상태, 필요시 제거

- [x] **0.3 Component Refactoring** ✅
  - [x] Create `useTreatmentFilters` hook (URL searchParams 기반)
  - [x] Create `useClinicFilters` hook (URL searchParams 기반)
  - [x] Split large page components (Server/Client 분리 완료)

- [x] **0.4 UI Improvements (Reference-based)** ✅
  - [x] Remove middle icon tab bar (이미 없음)
  - [x] Reduce Hero to 30-40vh (min-h-[240px] 적용)
  - [x] Make search bar sticky (sticky top-[72px] 구현됨)
  - [x] Clean up bottom nav (5 tabs: Home, Procedures, Clinics, Saved, Profile)

- [x] **0.5 API Versioning** ✅
  - [x] Create `/api/v1/` structure
  - [x] Move existing routes under v1
  - [x] Update client calls

- [x] **0.6 Taxonomy & Config Layer** ⭐ ✅
  - [x] Create `lib/constants/taxonomy.ts`
    - GOAL_TAGS, MODALITY_TAGS, AREA_TAGS, POSITIONING_TAGS
    - TypeScript types (GoalTag, ModalityTag, etc.)
  - [x] Create `lib/validations/taxonomy.ts`
    - Zod schemas for single tags and arrays
    - treatmentTagsSchema for create/update
  - [x] Create `config/nav-groups.ts`
    - NAV_GROUPS DSL (goals, modalities, areas)
    - NavGroupKey, NavGroup types
  - [x] Add `navGroupToPrismaWhere()` helper in queries
  - [x] Verify NextAuth v4.24.13 works with Next.js 16 (CI check)
  - [x] Add taxonomy fields to Prisma schema (goalTags, modalityTags, areaTags)

**Deliverables**:
- Clean query functions
- No mock data in pages
- Improved home UI
- /api/v1/ structure
- **taxonomy.ts + validations + nav-groups.ts ready**
- **NextAuth v4 compatibility confirmed**

---

### Phase 1: Data Model Extension

**Goal**: Add Device model and Treatment-Device relationship

**Duration**: ~1 week

#### Tasks

- [ ] **1.1 Prisma Schema Updates**
  - [ ] Add `Device` model with category enum
  - [ ] Add `TreatmentDevice` join table (role, positioning, pros/cons)
  - [ ] Add `ClinicDevice` join table
  - [ ] Add `TreatmentI18n`, `DeviceI18n` tables
  - [ ] Run migration

- [ ] **1.2 Seed Data**
  - [ ] Create Device seed (5-10 major devices)
    - PICO: PicoSure, PicoWay
    - FRACTIONAL: Fraxel, CO2
    - RF: Thermage, Oligio (or TenTherma)
    - HIFU: Ulthera, Shurink (or Doublo)
  - [ ] Create TreatmentDevice mappings
  - [ ] Update existing Treatment seed if needed

- [ ] **1.3 Device Queries**
  - [ ] `getDevices()` - list all
  - [ ] `getDeviceBySlug()` - single device
  - [ ] `getDevicesByTreatment()` - for treatment detail
  - [ ] `getTreatmentDeviceComparison()` - for compare modal

- [ ] **1.4 Device API Endpoints**
  - [ ] `GET /api/v1/devices`
  - [ ] `GET /api/v1/devices/{slug}`
  - [ ] `GET /api/v1/treatments/{slug}/devices`

**Deliverables**:
- Device model in DB
- TreatmentDevice relationships
- i18n tables ready
- Device API working

---

### Phase 2: Core Pages Implementation

**Goal**: Treatment detail with Device comparison, Onboarding flow

**Duration**: ~2 weeks

#### Tasks

- [ ] **2.1 Treatment Detail Page Redesign**
  - [ ] Quick Facts section (time, downtime, pain, sessions)
  - [ ] Who it's for section
  - [ ] Devices Used section with cards
  - [ ] Questions to Ask checklist
  - [ ] Related Community threads

- [ ] **2.2 Device Compare Modal**
  - [ ] Multi-select (2-3 devices)
  - [ ] Side-by-side comparison table
  - [ ] UX metrics (recovery, effect, pain)
  - [ ] Skin type cautions display

- [ ] **2.3 Basic Onboarding Flow**
  - [ ] Skin type selection (Fitzpatrick simplified)
  - [ ] Interest/concern tags selection
  - [ ] Travel schedule (optional)
  - [ ] Skip option (progressive)

- [ ] **2.4 Beauty Passport Quiz (Phase 2 후반)**
  - [ ] Quiz page (`/quiz`) - public access
  - [ ] A/B card selection UI
  - [ ] QuizSession model integration
  - [ ] Result page with sharing
  - [ ] Link to app/onboarding with token

- [ ] **2.5 User Profile Extension**
  - [ ] UserProfile model fields
  - [ ] Quiz result connection on signup
  - [ ] Profile page updates

**Deliverables**:
- Beautiful treatment detail page
- Device comparison working
- Onboarding flow
- Quiz with sharing

---

### Phase 3: Event Tracking

**Goal**: Set up analytics foundation for data-driven decisions

**Duration**: ~1 week

#### Tasks

- [ ] **3.1 PostHog Setup**
  - [ ] Install PostHog SDK
  - [ ] Configure client-side tracking
  - [ ] Configure server-side tracking
  - [ ] Set up project in PostHog dashboard

- [ ] **3.2 Client Tracking Hook**
  - [ ] Create `useTracking` hook
  - [ ] Implement `trackEvent` function
  - [ ] Auto-track page views
  - [ ] Batch event sending

- [ ] **3.3 Implement Core Events**
  - [ ] `content_view` on treatment/device pages
  - [ ] `device_compare_open/select`
  - [ ] `search` with query and filters
  - [ ] `quiz_start/complete`

- [ ] **3.4 Events API Endpoint**
  - [ ] `POST /api/v1/events`
  - [ ] Batch event processing
  - [ ] Forward to PostHog

**Deliverables**:
- PostHog integrated
- Core events firing
- Dashboard visibility

---

### Phase 4: Advertising System MVP

**Goal**: Enable clinic advertising with click-out model

**Duration**: ~2 weeks

#### Tasks

- [ ] **4.1 Ad Data Models**
  - [ ] `Campaign` model (clinicId, status, budget, targeting)
  - [ ] `AdCreative` model (locale, headline, image, CTA)
  - [ ] `AdEvent` model (or PostHog only)
  - [ ] Run migration

- [ ] **4.2 Ad Decision Service**
  - [ ] `lib/services/ads.service.ts`
  - [ ] Rule-based matching (locale, area, treatmentId)
  - [ ] Simple scoring (bid × relevance)
  - [ ] Token generation (randomId + Redis TTL write)

- [ ] **4.3 Ad Decision API**
  - [ ] `POST /api/v1/ads/decision`
  - [ ] Placement-based responses
  - [ ] Rate limiting

- [ ] **4.4 Click-out System**
  - [ ] `/r/[token]/route.ts`
  - [ ] Token lookup (Redis/DB)
  - [ ] Click event logging
  - [ ] 302 redirect to destination

- [ ] **4.5 AdCard Component**
  - [ ] [AD] badge styling
  - [ ] Click tracking on interaction
  - [ ] Multiple destination types (web, kakao, whatsapp, tel)

- [ ] **4.6 Ad Placements**
  - [ ] Home feed (1 slot)
  - [ ] Treatment detail (bottom)
  - [ ] Search results (top 1)

- [ ] **4.7 Ad Events**
  - [ ] `ad_impression` on view
  - [ ] `ad_click` on interaction
  - [ ] `clickout` on redirect

**Deliverables**:
- Campaign/Creative models
- Ad decision API
- Click-out tracking
- Ads showing in UI

---

### Phase 5: Community MVP

**Goal**: Cohort-based community for user retention

**Duration**: ~2 weeks

#### Tasks

- [ ] **5.1 Community Data Models**
  - [ ] `Thread` model (cohortType, cohortValue)
  - [ ] `Post` model (content, status, upvotes)
  - [ ] `PostReport` model
  - [ ] Seed initial threads (by ethnicity, skin tone)

- [ ] **5.2 Community Queries**
  - [ ] `getThreads()` with cohort filter
  - [ ] `getPosts()` with pagination, sorting
  - [ ] `getPostById()`

- [ ] **5.3 Community APIs**
  - [ ] `GET /api/v1/threads`
  - [ ] `GET /api/v1/posts`
  - [ ] `POST /api/v1/posts`
  - [ ] `POST /api/v1/posts/{id}/upvote`
  - [ ] `POST /api/v1/reports`

- [ ] **5.4 Community Pages**
  - [ ] Thread list page
  - [ ] Cohort feed page
  - [ ] Post detail page
  - [ ] Post creation form

- [ ] **5.5 Moderation Service**
  - [ ] `lib/services/moderation.service.ts`
  - [ ] Regex patterns for phone, kakao ID, price
  - [ ] Auto-flag suspicious content
  - [ ] Block auto-linking clinic info

- [ ] **5.6 Community Events**
  - [ ] `community_view`
  - [ ] `post_create`
  - [ ] `post_upvote`

**Deliverables**:
- Cohort-based threads
- Post CRUD
- Basic moderation
- Community section in UI

---

### Phase 6: Clinic Dashboard MVP

**Goal**: B2B interface for clinic advertising management

**Duration**: ~2 weeks

#### Tasks

- [ ] **6.1 Clinic Admin Auth**
  - [ ] Add `role` to User (user, clinic_admin, admin)
  - [ ] Add `clinicId` to User (for clinic admins)
  - [ ] Dashboard auth middleware
  - [ ] Separate dashboard layout

- [ ] **6.2 Dashboard Pages**
  - [ ] Dashboard home (overview)
  - [ ] Campaigns list
  - [ ] Campaign create/edit
  - [ ] Creatives management
  - [ ] Device inventory (보유 장비)

- [ ] **6.3 Campaign Management APIs**
  - [ ] `GET/POST /api/v1/dashboard/campaigns`
  - [ ] `GET/PUT/DELETE /api/v1/dashboard/campaigns/{id}`
  - [ ] `GET/POST /api/v1/dashboard/creatives`

- [ ] **6.4 Reports & Analytics**
  - [ ] Impressions, clicks, click-outs by campaign
  - [ ] CTR calculation
  - [ ] Basic charts (daily/weekly)
  - [ ] Export functionality

- [ ] **6.5 Clinic Profile Management**
  - [ ] Update clinic info
  - [ ] Manage device inventory
  - [ ] Language support settings

**Deliverables**:
- Clinic admin login
- Campaign CRUD
- Performance reports
- Device inventory management

---

## Part 7: Checklist Summary

### Phase 0 Completion Criteria ✅ COMPLETE
- [x] All pages use Query Functions (no direct Prisma in routes) ✅
- [x] No mock data imports in page components (Server Component 전환 완료) ✅
- [x] Home UI matches reference (reduced hero, sticky search) ✅
- [x] /api/v1/ structure in place ✅
- [x] `lib/constants/taxonomy.ts` exists with all tag sets ✅
- [x] `lib/validations/taxonomy.ts` exists with Zod schemas ✅
- [x] `config/nav-groups.ts` exists with DSL format ✅
- [x] NextAuth v4.24.13 login/logout works on Next.js 16 ✅
- [x] Prisma schema includes taxonomy fields (goalTags, modalityTags, areaTags) ✅
- [x] URL-based filter hooks created (useTreatmentFilters, useClinicFilters) ✅

### Phase 1 Completion Criteria
- [ ] Device table with 5-10 records
- [ ] TreatmentDevice mappings exist
- [ ] GET /api/v1/devices returns data
- [ ] i18n tables exist (empty OK)

### Phase 2 Completion Criteria
- [ ] Treatment detail shows device cards
- [ ] Compare modal works with 2-3 devices
- [ ] Onboarding flow completable
- [ ] Quiz shareable with result

### Phase 3 Completion Criteria
- [ ] PostHog receiving events
- [ ] content_view fires on page load
- [ ] search events include query
- [ ] Dashboard shows event counts

### Phase 4 Completion Criteria
- [ ] Ad shows on home feed
- [ ] Click-out redirect works
- [ ] Events: impression → click → clickout tracked
- [ ] [AD] badge visible

### Phase 5 Completion Criteria
- [ ] Can view threads by cohort
- [ ] Can create/upvote posts
- [ ] Phone/kakao patterns blocked
- [ ] Community accessible from home

### Phase 6 Completion Criteria
- [ ] Clinic admin can login to dashboard
- [ ] Can create campaign with creative
- [ ] Can see impression/click counts
- [ ] Can manage device inventory

---

## Appendix

### A. File Structure (Final)

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (public)/
│   │   ├── (auth)/
│   │   ├── (protected)/
│   │   └── layout.tsx
│   ├── dashboard/
│   ├── r/[token]/route.ts
│   └── api/v1/
├── components/
│   ├── ui/
│   ├── common/
│   ├── cards/
│   ├── feed/
│   ├── community/
│   └── dashboard/
├── lib/
│   ├── db/
│   │   ├── prisma.ts
│   │   └── queries/
│   ├── services/
│   ├── actions/
│   ├── tracking/
│   └── validations/
├── hooks/
├── types/
└── config/
```

### B. Environment Variables (Phase 4+)

```env
# Existing
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=

# New
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
POSTHOG_KEY=
POSTHOG_HOST=
```

### C. Glossary

| Term | Definition |
|------|------------|
| Treatment | 시술 (e.g., Laser Resurfacing, Botox) |
| Device | 장비 (e.g., PicoSure, Fraxel) |
| DeviceFamily/Category | 장비 계열 (e.g., PICO, FRACTIONAL) |
| Click-out | 외부 채널로 이동 (병원 웹사이트, 카카오 등) |
| Cohort | 커뮤니티 그룹 기준 (ethnicity, skin tone) |
| Positioning | Device의 특성 태그 (FasterRecovery, Gentler 등) |
| Beauty Passport | 마케팅용 A/B 선택 퀴즈 |

---

## Document History

| Date | Version | Changes |
|------|---------|---------|
| 2025-01-03 | 1.0 | Initial planning document |
| 2026-01-03 | 1.1 | TIGHTENING → LIFTING 통합, NAV_GROUPS config layer 추가, PEEL은 modality-only 명시 |
| 2026-01-03 | 1.2 | HAIR_REMOVAL 추가 (10개 GOAL), Phase 0.6 taxonomy 태스크 추가, Zod validators 섹션 추가, NAV_GROUPS DSL 형태로 변경 (Prisma 의존성 분리) |

