# Design Guidelines for Student Productivity PWA

## Design Approach
**Selected Framework**: Material Design principles adapted for productivity
**Rationale**: Information-dense student productivity app requiring clarity, consistency, and efficient data visualization. The app prioritizes usability and data comprehension over decorative elements.

## Core Design Principles
1. **Clarity First**: Every UI element serves a functional purpose
2. **Data Visibility**: Information hierarchy guides users to critical metrics (grades, upcoming exams, habit streaks)
3. **Theme Integration**: Selected palette colors distributed throughout UI, not relegated to accents only
4. **Mobile-First Responsive**: Bottom navigation for mobile, sidebar for desktop

## Color System

### Theme Palettes (User-Selectable)
**Theme 1 (T1) - Academic Blue**
- Primary: 233 45% 35% (Deep Blue)
- Secondary: 224 45% 75% (Light Periwinkle)
- Accent: 2 72% 76% (Soft Coral)
- Muted: 48 55% 82% (Cream)
- Surface: 220 40% 25% (Dark Slate)

**Theme 2 (T2) - Natural Tones**
- Primary: 196 45% 68% (Sky Blue)
- Secondary: 247 30% 56% (Lavender)
- Accent: 21 40% 57% (Terracotta)
- Muted: 54 75% 82% (Light Yellow)
- Surface: 85 10% 31% (Olive Green)

**Theme 3 (T3) - Soft Pastel**
- Primary: 0 45% 97% (Blush White)
- Secondary: 160 68% 74% (Mint Green)
- Accent: 163 72% 82% (Aqua Mint)
- Muted: 33 100% 80% (Peach)
- Surface: 33 100% 70% (Warm Orange)

### Dark/Light Mode Implementation
**Light Mode (Default 10:00 AM - 6:00 PM)**
- Background: Theme's lightest color (Primary at 95% lightness)
- Cards: White with subtle theme-tinted shadows
- Text: Theme Primary at 20% lightness for body, 10% for headings

**Dark Mode (Default 6:00 PM - 10:00 AM)**
- Background: 220 15% 12% (Near Black)
- Cards: 220 15% 18% (Charcoal) with theme-colored borders
- Text: 220 15% 95% (Off White) for readability

**Auto-Scheduling**: Toggle in settings with manual override. Smooth transitions at scheduled times.

## Typography
**Font Stack**: Inter (primary), system-ui (fallback)
- **Headings**: 600-700 weight, theme primary color
- **Body**: 400 weight, 16px base, 1.5 line-height
- **Labels**: 500 weight, 14px, theme secondary color
- **Data/Stats**: 700 weight, larger sizes for emphasis

## Layout System
**Spacing Scale**: Tailwind units 2, 4, 6, 8, 12, 16, 24
- Cards: p-6 (24px padding)
- Sections: py-8 (32px vertical)
- Component gaps: gap-4 (16px)
- Page margins: px-4 md:px-8

**Grid System**: 
- Mobile: Single column, full width
- Tablet: 2 columns for cards (grid-cols-1 md:grid-cols-2)
- Desktop: 3-4 columns where appropriate (lg:grid-cols-3, xl:grid-cols-4)

## Component Library

### Navigation
**Mobile Bottom Navigation (< 768px)**
- Fixed bottom bar with 5 icons: Dashboard, Habits, Exams, Grades, Settings
- Active state: Theme primary background with white icon
- Inactive: Theme muted foreground
- Height: 64px with safe-area-inset-bottom

**Desktop Sidebar (≥ 768px)**
- Left-aligned, 240px width
- Theme primary background in dark mode, theme secondary (light) in light mode
- Logo/app name at top
- Navigation items with icons and labels
- Settings at bottom

### Dashboard Cards
**Habit Summary Card**
- Today's habits with checkboxes
- Streak counter badge (flame icon + number)
- Progress bar showing completion percentage
- Quick add button

**Next Exam Card**
- Subject name with theme accent background chip
- Countdown timer (e.g., "3 days remaining")
- Difficulty indicator (colored dots)
- Progress slider (0-100%)

**Grade Average Card**
- Large centered GPA number (theme primary color, 48px)
- Circular progress chart (completed exams vs total)
- Subject breakdown list with mini bar charts

**Mood Tracker Widget**
- Emoji selector (😊 😴 😰 🎯) for mood
- Energy level slider (1-5 stars)
- Weekly mood calendar grid

**Motivational Quote Card**
- Rotating English quotes (e.g., "Success is the sum of small efforts repeated daily")
- Subtle theme accent border-left (4px)
- Refreshes daily

### Forms & Inputs
**Text Inputs**
- Border: 2px theme border color
- Focus: theme primary ring (ring-2)
- Background: card background (not pure white)
- Height: 44px minimum for touch targets

**Checkboxes (Habits)**
- Custom styled, 28x28px
- Unchecked: border-2 theme border
- Checked: theme primary background with white checkmark
- Smooth transition (duration-200)

**Sliders (Progress, Energy)**
- Track: theme muted background
- Filled track: theme primary
- Thumb: theme accent, 20px diameter with shadow

### Data Visualizations
**Circular Exam Chart (Recharts)**
- Donut chart showing completed (theme primary) vs remaining (theme muted)
- Center label: percentage and count
- 160px diameter
- Animated on load

**Grade Bar Charts**
- Horizontal bars for subject grades
- Height: 12px, rounded-full
- Fill: gradient from theme primary to accent
- Background: theme muted

**Streak Indicators**
- Flame icon (🔥) with number
- Background: theme accent at 10% opacity
- Text: theme accent color
- Display prominently on habit cards

### Priority & Status Badges
**Priority Levels**
- High: border-l-4 border-destructive (red)
- Medium: border-l-4 border-warning (amber)
- Low: border-l-4 border-success (green)

**Exam Status Chips**
- Not Started: theme muted background, dark text
- In Progress: theme accent background, white text
- Completed: theme primary background, white text
- Rounded-full, px-3 py-1, text-sm

### Settings Page
**Theme Selector**
- 3 preview cards showing palette colors
- Selected state: ring-4 theme primary
- Click to apply immediately

**Dark Mode Schedule**
- Toggle switch (theme primary when active)
- Time pickers for auto-switch (10:00 AM, 6:00 PM defaults)
- Manual override toggle

**Color Customization**
- Advanced section with color pickers for each theme role
- Live preview of changes
- Reset to default button

## Accessibility & Readability
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text
- All interactive elements: minimum 44x44px touch target
- Focus indicators: 2px theme primary ring
- Screen reader labels for all icons
- Keyboard navigation support

## PWA Enhancements
**Offline Indicators**
- Toast notification when offline (theme warning)
- Sync status indicator in navbar
- Cached data badge on cards

**Installation Prompt**
- Dismissible banner on first visit
- "Add to Home Screen" in settings
- Custom splash screen with theme colors

## Micro-interactions
- Card hover: subtle lift (translate-y-1) with shadow increase
- Button press: scale-95 with theme primary darkening
- Checkbox toggle: smooth checkmark draw animation
- Tab transitions: slide effect with theme accent underline
- Loading states: theme primary spinner (border-t-transparent)

## Images & Icons
**Icon System**: Lucide React (already installed)
- Consistent 24px size throughout
- Theme foreground color with opacity variations
- Habit icons: CheckCircle, Target, Zap
- Exam icons: BookOpen, Calendar, TrendingUp
- Grade icons: Award, BarChart, Star
- Mood icons: Smile, Frown, Meh, Battery

**No Hero Images**: App is utility-focused, no decorative hero sections. Dashboard starts immediately with functional cards.

## Responsive Breakpoints
- Mobile: < 768px (single column, bottom nav)
- Tablet: 768px - 1024px (2 columns, sidebar appears)
- Desktop: ≥ 1024px (3-4 columns, full sidebar)

This design creates a cohesive, theme-integrated productivity app where colors enhance usability rather than distract, with seamless dark mode and PWA capabilities for students on any device.