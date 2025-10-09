# Studique - Student Productivity PWA

## Overview

Studique is a Progressive Web App (PWA) designed for students to manage their academic life through four core modules: habit tracking, todo management, exam planning, and grade monitoring. The application features a customizable theming system with three color palettes, dark/light mode support with automatic scheduling, and mood/energy tracking for productivity insights.

**Tech Stack:**
- Frontend: React with TypeScript, Vite build tool
- UI: Radix UI primitives with shadcn/ui components, Tailwind CSS
- Backend: Express.js server
- Database: PostgreSQL with Drizzle ORM
- State Management: TanStack Query (React Query)
- Authentication: Passport.js with local strategy
- Routing: Wouter (lightweight React router)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component Structure:**
- **Pages:** Modular page components for Dashboard, Habits, Todos, Exams, Grades, and Settings
- **Reusable Components:** Card-based UI components (HabitCard, ExamCard, GradeDisplay, StatCard, etc.)
- **Layout:** Responsive design with mobile bottom navigation and desktop sidebar navigation
- **State Management:** React Query for server state, React Context for theme/auth state

**Design System:**
- Three pre-defined color themes (Academic Blue, Natural Tones, Soft Pastel)
- Dark/light mode with auto-scheduling (10 AM-6 PM light, 6 PM-10 AM dark)
- Material Design principles adapted for productivity apps
- Mobile-first responsive approach

**Routing Strategy:**
- Client-side routing with Wouter
- Protected routes requiring authentication
- Single-page application architecture

### Backend Architecture

**API Design:**
- RESTful API endpoints under `/api/*`
- Session-based authentication using Passport.js
- Express middleware for request logging and error handling

**Authentication Flow:**
- Local strategy with username/password
- Session persistence with PostgreSQL store
- Password hashing using bcrypt (scrypt implementation)
- Protected route middleware (`isAuthenticated`)

**Data Layer:**
- Drizzle ORM for type-safe database queries
- Storage abstraction layer (`IStorage` interface)
- Neon PostgreSQL serverless database

### Database Schema

**Core Tables:**
- `users` - User accounts with credentials and profile info
- `habits` - Daily habits with streak tracking and completion dates
- `todos` - Task management with completion status
- `subjects` - Academic subjects for organizing exams and grades
- `grades` - Grade records linked to subjects with weight factors
- `exams` - Exam planning with difficulty, status, progress tracking
- `moods` - Daily mood and energy level tracking
- `userSettings` - User preferences for theme and dark mode
- `sessions` - Session storage for authentication

**Key Relationships:**
- All content tables cascade delete on user removal
- Grades and Exams link to Subjects
- Habits track completion via date arrays
- Settings are per-user configuration

### Authentication & Session Management

**Session Storage:**
- PostgreSQL-backed session store using `connect-pg-simple`
- 7-day session expiration
- HTTP-only cookies for security

**Password Security:**
- Scrypt-based password hashing with random salt
- Timing-safe comparison for password verification

**Authorization:**
- Middleware-based route protection
- User context available in protected routes via `req.user`

## External Dependencies

### Database & ORM
- **Neon PostgreSQL:** Serverless PostgreSQL database
- **Drizzle ORM:** Type-safe ORM with PostgreSQL dialect
- **drizzle-kit:** Database migration and schema management

### UI Framework
- **Radix UI:** Headless UI primitives (accordion, dialog, dropdown, etc.)
- **shadcn/ui:** Pre-built accessible components
- **Tailwind CSS:** Utility-first CSS framework
- **Lucide React:** Icon library

### State & Data Fetching
- **TanStack Query (React Query):** Server state management and caching
- **Wouter:** Lightweight routing library

### Authentication & Security
- **Passport.js:** Authentication middleware
- **passport-local:** Username/password strategy
- **bcrypt:** Password hashing
- **express-session:** Session middleware
- **connect-pg-simple:** PostgreSQL session store

### Development Tools
- **Vite:** Build tool and dev server
- **TypeScript:** Type safety
- **ESBuild:** Production bundler
- **tsx:** TypeScript execution for development

### Form & Validation
- **React Hook Form:** Form state management
- **Zod:** Schema validation
- **@hookform/resolvers:** Zod resolver for React Hook Form

### Data Visualization
- **Recharts:** Chart library for exam progress visualization
- **date-fns:** Date manipulation and formatting

### Progressive Web App
- **Manifest:** PWA configuration for installability
- **Service Worker:** (Implied for offline support)