# Pome App - UI/UX Redesign Plan

## Overview

This document outlines the comprehensive plan to update the Pome app's UI/UX based on the reference design. The redesign will start with the homepage and extend to all other pages for a cohesive, modern user experience.

---

## Phase 1: Homepage Redesign

### Current State Analysis

**Current Homepage Structure:**
```
1. Hero Banner (gradient background, title, subtitle)
2. Sticky Search Input
3. Featured Clinics (horizontal scroll)
4. Popular Procedures (grid layout)
```

**Current Design Characteristics:**
- ✅ Functional layout
- ✅ Responsive design
- ❌ Less visual impact
- ❌ Simple gradient hero
- ❌ Basic card styling
- ❌ Limited use of images
- ❌ No rounded corner container for hero

### Target Design Analysis (From Reference)

**Reference Design Features:**
```
1. Hero Section
   - Rounded container with background image/gradient
   - Centered white text overlay
   - Modern shadow/blur effects
   - More compact, focused design

2. Search Bar
   - Clean, simple design
   - Light gray background
   - Search icon on left
   - Positioned below hero

3. Featured Clinics
   - Image-heavy cards
   - "Verified" badges (red/pink with icon)
   - Clinic photos as main focus
   - Clean white cards with shadow
   - Horizontal scroll maintained

4. Popular Procedures
   - 2-column grid on mobile
   - Icon-based cards
   - Gradient/colored backgrounds per procedure
   - Simpler layout, more visual

5. Bottom Navigation
   - 5 items: Home, Clinics, Procedures, Saved, Profile
   - Icon + label
   - Active state highlighting
```

---

## Implementation Roadmap

### Task 1: Hero Section Redesign ⭐ Priority

**Goal:** Create a visually impactful hero with rounded container and image background

**Changes Needed:**
1. **Hero Container**
   - Add rounded corners (rounded-3xl)
   - Add background image or enhanced gradient
   - Add shadow for depth
   - Center-align content
   - Reduce padding for more compact design

2. **Typography**
   - Maintain large heading
   - Keep centered layout
   - Ensure good contrast with background

3. **New Component Structure:**
```tsx
<div className="px-4 sm:px-6 mb-6">
  <div className="relative rounded-3xl overflow-hidden shadow-xl">
    {/* Background image or gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-rose-100 to-white" />

    {/* Content */}
    <div className="relative px-8 py-16 text-center">
      <h1 className="text-4xl font-bold text-white mb-2">
        Your Trusted Guide to Beauty in Korea
      </h1>
    </div>
  </div>
</div>
```

**Files to Modify:**
- `src/app/[locale]/page.tsx` - Homepage hero section

**Estimated Time:** 1-2 hours

---

### Task 2: Search Input Redesign

**Goal:** Simplify search input design to match reference

**Changes Needed:**
1. **Search Input Styling**
   - Lighter background (bg-gray-50)
   - Simpler border
   - Left-aligned search icon
   - Remove sticky behavior (or make optional)
   - Reduce size slightly

2. **New Component Structure:**
```tsx
<div className="px-4 sm:px-6 mb-6">
  <div className="max-w-2xl mx-auto">
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search treatments or clinics..."
        className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none"
      />
    </div>
  </div>
</div>
```

**Files to Modify:**
- `src/components/search/search-input.tsx` - Search input component
- `src/app/[locale]/page.tsx` - Remove sticky behavior

**Estimated Time:** 30 minutes - 1 hour

---

### Task 3: Featured Clinics Cards Redesign ⭐ Priority

**Goal:** Image-first clinic cards with prominent verified badges

**Changes Needed:**
1. **Clinic Card Component**
   - Larger image area (60-70% of card)
   - Image as primary focus
   - Verified badge overlay on image (top-left)
   - Red/pink badge with white icon
   - Cleaner typography
   - White background with subtle shadow

2. **Badge Component (NEW)**
```tsx
// src/components/ui/verified-badge.tsx
<div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary rounded-full text-white text-sm font-medium">
  <Check className="h-4 w-4" />
  Verified
</div>
```

3. **Card Structure:**
```tsx
<div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
  {/* Image Section */}
  <div className="relative h-48 overflow-hidden">
    <img src={clinic.imageUrl} className="w-full h-full object-cover" />

    {/* Verified Badge Overlay */}
    {clinic.verified && (
      <div className="absolute top-3 left-3">
        <VerifiedBadge />
      </div>
    )}
  </div>

  {/* Info Section */}
  <div className="p-4">
    <h3 className="font-semibold text-lg mb-1">{clinic.name}</h3>
    <p className="text-sm text-gray-600">{clinic.location}</p>
  </div>
</div>
```

**Files to Modify:**
- `src/components/cards/clinic-card.tsx` - Redesign card
- `src/components/ui/verified-badge.tsx` - NEW component

**Estimated Time:** 1-2 hours

---

### Task 4: Popular Procedures Cards Redesign ⭐ Priority

**Goal:** Icon-based procedure cards with colored backgrounds

**Changes Needed:**
1. **Treatment Card Component**
   - Simpler, more compact design
   - Large icon at top
   - Colored/gradient background
   - Remove image (icon only)
   - Procedure name + short description
   - 2-column grid on mobile

2. **Icon Background Colors:**
   - Laser Toning: Pink gradient
   - Botox: Light pink/rose
   - Rhinoplasty: Soft pink
   - Facial Peels: Light rose

3. **Card Structure:**
```tsx
<div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-2xl p-6">
  {/* Icon Circle */}
  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-4">
    <Sparkles className="h-7 w-7 text-white" />
  </div>

  {/* Content */}
  <h3 className="font-semibold text-lg mb-2">{treatment.name}</h3>
  <p className="text-sm text-gray-600">{treatment.shortDescription}</p>
</div>
```

**Files to Modify:**
- `src/components/cards/treatment-card.tsx` - Redesign card
- Add treatment icon mappings
- Update homepage grid to 2 columns on mobile

**Estimated Time:** 2-3 hours

---

### Task 5: Section Headers Redesign

**Goal:** Cleaner section headers with "See All" links

**Changes Needed:**
1. **Section Header Styling**
   - Bolder typography
   - Red "See All" text (text-primary)
   - Better spacing
   - Consistent across sections

2. **Component Structure:**
```tsx
<div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">{title}</h2>
  <Link href={href} className="text-primary font-medium">
    See All
  </Link>
</div>
```

**Files to Modify:**
- `src/app/[locale]/page.tsx` - Update section headers
- Consider creating reusable SectionHeader component

**Estimated Time:** 30 minutes

---

### Task 6: Bottom Navigation (If not exists)

**Goal:** Add 5-item bottom navigation (Home, Clinics, Procedures, Saved, Profile)

**Changes Needed:**
1. **Check if bottom nav exists**
   - If yes: Update styling to match reference
   - If no: Create new component

2. **Bottom Nav Structure:**
```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
  <div className="flex items-center justify-around py-2">
    <NavItem icon={Home} label="Home" active />
    <NavItem icon={Building2} label="Clinics" />
    <NavItem icon={Sparkles} label="Procedures" />
    <NavItem icon={Bookmark} label="Saved" />
    <NavItem icon={User} label="Profile" />
  </div>
</nav>
```

**Files to Check/Modify:**
- `src/components/layout/bottom-nav.tsx` - Update or create
- Ensure active state matches reference (pink background circle)

**Estimated Time:** 1-2 hours

---

## Implementation Order (Priority)

### Sprint 1: Core Visual Updates (Day 1-2)
1. ✅ Hero Section Redesign (2 hours)
2. ✅ Featured Clinics Cards (2 hours)
3. ✅ Popular Procedures Cards (3 hours)

### Sprint 2: Polish & Details (Day 2-3)
4. ✅ Search Input Redesign (1 hour)
5. ✅ Section Headers (30 min)
6. ✅ Bottom Navigation (1-2 hours)
7. ✅ Spacing & Typography refinements (1 hour)

### Sprint 3: Testing & Refinement (Day 3)
8. ✅ Mobile responsiveness testing
9. ✅ Dark mode adjustments
10. ✅ Accessibility review
11. ✅ Performance optimization

**Total Estimated Time: 2-3 days**

---

## New Components to Create

### 1. VerifiedBadge Component
```typescript
// src/components/ui/verified-badge.tsx
interface VerifiedBadgeProps {
  className?: string;
}

export function VerifiedBadge({ className }: VerifiedBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5",
      "bg-primary rounded-full text-white text-sm font-medium shadow-sm",
      className
    )}>
      <CheckCircle2 className="h-4 w-4" />
      Verified
    </div>
  );
}
```

### 2. SectionHeader Component (Optional)
```typescript
// src/components/ui/section-header.tsx
interface SectionHeaderProps {
  title: string;
  href?: string;
  linkText?: string;
}

export function SectionHeader({ title, href, linkText = "See All" }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {href && (
        <Link href={href} className="text-primary font-medium hover:underline">
          {linkText}
        </Link>
      )}
    </div>
  );
}
```

---

## Design System Updates

### Color Palette Adjustments

```css
/* Add to tailwind.config.ts or globals.css */

:root {
  /* Existing primary (red) - keep as is */
  --primary: #D90429;

  /* Add soft pink/rose tones for backgrounds */
  --rose-50: #fff1f2;
  --rose-100: #ffe4e6;
  --rose-200: #fecdd3;

  /* Card shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### Typography Scale

```css
/* Heading sizes based on reference */
.hero-title {
  @apply text-4xl sm:text-5xl font-bold;
}

.section-title {
  @apply text-2xl font-bold;
}

.card-title {
  @apply text-lg font-semibold;
}

.card-description {
  @apply text-sm text-gray-600;
}
```

### Spacing System

```css
/* Consistent spacing */
.section-spacing {
  @apply mb-12;
}

.card-spacing {
  @apply p-4;
}

.hero-spacing {
  @apply py-16 px-8;
}
```

---

## Phase 2: Other Pages Redesign

After homepage is complete, apply similar design patterns to:

### 1. Treatments Page
- Grid of treatment cards (same style as homepage)
- Filters sidebar
- Search functionality
- Hero banner

**Estimated Time: 2-3 days**

### 2. Clinics Page
- Grid of clinic cards (same style as homepage)
- Map view option
- Filters sidebar
- Search functionality

**Estimated Time: 2-3 days**

### 3. Treatment Detail Page
- Hero image section
- Treatment info cards
- Related clinics section
- Before/after gallery
- Booking CTA

**Estimated Time: 2-3 days**

### 4. Clinic Detail Page
- Clinic photo gallery
- Information cards
- Treatments offered
- Location map
- Reviews section
- Booking CTA

**Estimated Time: 2-3 days**

### 5. Search Results Page
- Combined results (treatments + clinics)
- Filter options
- Sort options
- Card layouts matching homepage

**Estimated Time: 1-2 days**

### 6. Profile Page
- User info section
- Settings
- Saved items
- Profile picture (from Google OAuth!)

**Estimated Time: 1-2 days**

### 7. Saved Items Page
- Grid of saved clinics and treatments
- Remove functionality
- Notes/comments

**Estimated Time: 1 day**

---

## Technical Considerations

### Performance

1. **Image Optimization**
   - Use Next.js Image component
   - Lazy loading for cards
   - Proper sizing and formats (WebP)

2. **Code Splitting**
   - Lazy load heavy components
   - Dynamic imports where appropriate

3. **CSS Optimization**
   - Use Tailwind's purge feature
   - Minimize custom CSS
   - Reuse utility classes

### Responsive Design

1. **Breakpoints**
   - Mobile: < 640px (1 column)
   - Tablet: 640px - 1024px (2 columns)
   - Desktop: 1024px+ (3-4 columns)

2. **Touch Targets**
   - Minimum 44x44px for buttons
   - Adequate spacing between interactive elements

3. **Horizontal Scroll**
   - Maintain for Featured Clinics on mobile
   - Ensure smooth scrolling

### Accessibility

1. **Semantic HTML**
   - Proper heading hierarchy
   - Aria labels where needed
   - Alt text for images

2. **Keyboard Navigation**
   - All interactive elements accessible
   - Focus states visible

3. **Color Contrast**
   - WCAG AA compliance
   - Test with dark mode

### Dark Mode

1. **Update dark mode colors**
   - Adjust pink/rose tones for dark backgrounds
   - Ensure proper contrast
   - Test all components

---

## Testing Checklist

### Visual Testing
- [ ] Compare with reference design
- [ ] Check all breakpoints (mobile, tablet, desktop)
- [ ] Verify spacing and alignment
- [ ] Test with real clinic images
- [ ] Check icon sizing and colors

### Functional Testing
- [ ] Search functionality works
- [ ] Cards clickable and navigation works
- [ ] Horizontal scroll smooth
- [ ] Verified badges show correctly
- [ ] "See All" links work

### Browser Testing
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Mobile browsers (iOS Safari, Chrome Android)

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] No layout shifts

---

## Assets Needed

### Icons
- ✅ Home icon
- ✅ Clinics icon (Building2)
- ✅ Procedures icon (Sparkles)
- ✅ Saved icon (Bookmark)
- ✅ Profile icon (User)
- ✅ Verified icon (CheckCircle2)
- ✅ Search icon (Search)

### Treatment Icons
- Laser Toning: Sparkles
- Botox: Syringe
- Rhinoplasty: Smile (or custom)
- Facial Peels: Droplet

### Images
- Hero background image (gradient for now)
- Clinic photos (use existing data)
- Treatment icons (use Lucide icons)

---

## Success Metrics

### User Experience
- Improved visual appeal
- Clearer information hierarchy
- Faster navigation
- Better mobile experience

### Technical
- Lighthouse score improvement
- Reduced bounce rate
- Increased time on page
- Better conversion rates

### Design Consistency
- Unified design language
- Consistent spacing
- Cohesive color palette
- Reusable components

---

## Risk Assessment & Mitigation

### Potential Risks

1. **Breaking Existing Functionality**
   - Mitigation: Test thoroughly after each change
   - Keep Git commits small and focused

2. **Performance Degradation**
   - Mitigation: Monitor bundle size
   - Optimize images properly

3. **Accessibility Issues**
   - Mitigation: Run accessibility audits
   - Test with screen readers

4. **Dark Mode Conflicts**
   - Mitigation: Test dark mode after each change
   - Use CSS variables for theming

---

## Next Steps

1. **Review and Approve Plan**
   - Get feedback on proposed changes
   - Prioritize tasks if needed
   - Adjust timeline

2. **Set Up Development Branch**
   ```bash
   git checkout -b feature/homepage-redesign
   ```

3. **Start with Task 1: Hero Section**
   - Create backup of current design
   - Implement changes incrementally
   - Test and commit

4. **Iterate Through Tasks**
   - Follow priority order
   - Test after each task
   - Get feedback early

---

## Ready to Start! 🚀

Once approved, we'll begin with **Task 1: Hero Section Redesign** and work through each task systematically.

Let me know if you want to:
- Adjust any priorities
- Add/remove any tasks
- Clarify any technical details
- Start implementation immediately!
