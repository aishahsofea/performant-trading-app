# Performant Trading App

A high-performance trading application built with Next.js, TypeScript, and a modern tech stack. This monorepo includes a comprehensive dashboard, design system, and performance optimization tools.

## 🏗️ Project Structure

This is a monorepo using **PNPM workspaces** and **Turborepo** for efficient build orchestration:

```
performant-trading-app/
├── apps/
│   ├── dashboard/          # Main trading dashboard (Next.js 15)
│   └── storybook/          # Design system showcase (Vite + React)
├── packages/
│   ├── ui/                 # Shared UI component library
│   ├── performance-lib/    # Performance utilities and solar system demo
│   ├── tailwind-config/    # Shared Tailwind configuration
│   └── typescript-config/  # Shared TypeScript configurations
├── docs/                   # Architecture and PRD documentation
└── web-bundles/            # Agent configurations and teams
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **PNPM**: 10.0.0+ (specified in `packageManager`)
- **PostgreSQL**: For the database (Supabase recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd performant-trading-app
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp apps/dashboard/env.example apps/dashboard/.env.local
   ```
   Edit `apps/dashboard/.env.local` with your configuration (see [Environment Configuration](#environment-configuration)).

4. **Set up the database:**
   ```bash
   cd apps/dashboard
   pnpm db:generate  # Generate migrations
   pnpm db:push      # Push schema to database
   ```

5. **Start development:**
   ```bash
   # Start all apps in development mode
   pnpm dev
   
   # Or start specific apps
   cd apps/dashboard && pnpm dev    # Dashboard at http://localhost:3000
   cd apps/storybook && pnpm dev    # Storybook at http://localhost:5173
   ```

## 📦 Components Overview

### Apps

#### Dashboard (`apps/dashboard/`)
The main trading application built with:
- **Framework**: Next.js 15 with Turbopack
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Drizzle ORM + PostgreSQL (Supabase)
- **Styling**: Tailwind CSS 4.1
- **Testing**: Vitest + Testing Library + Playwright
- **Performance**: Lighthouse CI, DevTools automation, bundle analysis

**Key Features:**
- User authentication and registration
- Trading dashboard with customizable layouts
- Performance monitoring and metrics collection
- Onboarding flow for new users
- Profile management and portfolio settings

#### Storybook (`apps/storybook/`)
Design system showcase and component development environment:
- **Framework**: Vite + React 19
- **Purpose**: Component library documentation and testing

### Packages

#### UI Library (`packages/ui/`)
Shared component library with:
- Form components (Input, Button, Checkbox, etc.)
- Display components (Alert, Badge, Card, etc.)
- Design tokens and theme configuration
- Fully typed with TypeScript

#### Performance Library (`packages/performance-lib/`)
Performance utilities including:
- Solar system visualization demo
- Bundle analysis tools
- Performance measurement utilities

#### Configuration Packages
- `packages/tailwind-config/`: Shared Tailwind CSS configuration
- `packages/typescript-config/`: Base TypeScript configurations

## 🔧 Environment Configuration

Create `apps/dashboard/.env.local` based on `env.example`:

### Required Variables

```env
# Application
BASE_URL='http://localhost:3000'

# Database (Supabase recommended)
DATABASE_URL=postgresql://postgres.username:[PASSWORD]@host:port/database

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to your `.env.local`

### Setting up Supabase Database

1. Create a [Supabase](https://supabase.com) project
2. Get the connection string from Settings → Database
3. Use the **Session pooler** connection string for `DATABASE_URL`

## 🛠️ Development Workflow

### Available Scripts

**Root level (affects all workspaces):**
```bash
pnpm dev           # Start all apps in development
pnpm build         # Build all packages and apps
pnpm lint          # Lint all workspaces
pnpm type-check    # Type check all workspaces
pnpm clean         # Clean all build artifacts
```

**Dashboard specific:**
```bash
cd apps/dashboard

# Development
pnpm dev                    # Start with Turbopack
pnpm build                  # Production build
pnpm start                  # Start production server

# Code quality
pnpm lint                   # ESLint
pnpm check-types           # TypeScript check
pnpm test                  # Run tests with Vitest
pnpm test:ui               # Tests with UI

# Database
pnpm db:generate           # Generate Drizzle migrations
pnpm db:push               # Push schema to database
pnpm db:migrate            # Run migrations
pnpm db:studio             # Open Drizzle Studio

# Performance
pnpm lighthouse            # Run Lighthouse CI
pnpm analyze-bundle        # Bundle analysis
pnpm performance:check-budgets     # Performance budget check
pnpm devtools:capture      # Capture DevTools profiles
pnpm devtools:analyze      # Analyze performance profiles
```

### Testing

The project includes comprehensive testing setup:

**Unit & Integration Tests:**
- Framework: Vitest + Testing Library
- Config: `apps/dashboard/vitest.config.mts`
- Run: `pnpm test` or `pnpm test:ui`

**E2E & Performance Tests:**
- Framework: Playwright
- DevTools automation for performance testing
- Run: `pnpm test:devtools`

### Performance Monitoring

Built-in performance monitoring includes:
- **Lighthouse CI**: Automated performance audits
- **DevTools Automation**: CPU/Memory profiling
- **Bundle Analysis**: Webpack bundle analyzer
- **Performance Budgets**: Configurable performance thresholds

## 🏛️ Architecture

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19 (Canary)
- TypeScript 5
- Tailwind CSS 4.1

**Backend:**
- Next.js API Routes
- Drizzle ORM
- PostgreSQL (Supabase)

**Authentication:**
- NextAuth.js
- Google OAuth

**Development:**
- Turborepo (monorepo)
- PNPM (package manager)
- ESLint + Prettier
- Husky (git hooks)
- Vitest (testing)

### Database Schema

Key entities include:
- **Users**: Authentication and profile data
- **Trading**: Portfolio and preferences
- **Dashboard**: Layout configurations
- **Onboarding**: User journey tracking

Schema files: `apps/dashboard/src/lib/db/schema/`

## 🔧 Deployment

### Production Build

```bash
# Build all packages and apps
pnpm build

# Build dashboard only
cd apps/dashboard && pnpm build
```

### Environment Variables (Production)

Update these for production:
- `BASE_URL`: Your production domain
- `NEXTAUTH_URL`: Your production domain
- `NEXTAUTH_SECRET`: Strong random secret
- `DATABASE_URL`: Production database connection
- Google OAuth: Update redirect URIs in Google Console

## 📚 Documentation

- `docs/architecture/`: Technical architecture documentation
- `docs/prd/`: Product requirements and specifications
- `packages/ui/src/`: Component documentation in Storybook

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Run `pnpm dev:workflow` before committing (type check + lint + performance check)
4. Use conventional commits for commit messages

## 🔍 Troubleshooting

### Common Issues

**Dependencies:**
- Run `pnpm install` from the root to ensure all workspaces are updated
- Clear node_modules: `pnpm clean` then `pnpm install`

**Database:**
- Ensure PostgreSQL is running
- Check connection string format in `.env.local`
- Run `pnpm db:push` to sync schema

**Performance:**
- Check DevTools profiles in `apps/dashboard/devtools-results/`
- Review performance budgets in `apps/dashboard/src/scripts/performance-budget.json`

---

**Package Manager:** PNPM 10.0.0  
**Node Version:** 18+ LTS  
**License:** Private