# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js admin dashboard application ("AI管理后台") with a multi-layered backend architecture.

**Tech Stack:**
- Frontend: Next.js 16.1.6 (App Router), React 19.2.3, TypeScript 5
- Styling: Tailwind CSS 4 with custom CSS variables
- Database: MySQL with Prisma 7.4.1 ORM
- Icons: @heroicons/react 2.2.0
- Charts: recharts 3.7.0

## Common Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

**Database (Prisma):**
```bash
npx prisma generate   # Generate Prisma client
npx prisma db push    # Push schema to database
npx prisma migrate    # Run migrations
```

## Architecture

### Frontend Structure (`src/app/`)
- App Router with pages: `/` (dashboard), `/login`, `/orders`, `/products`, `/users`
- Components in `src/components/`: layout (Sidebar, Navbar, Footer), dashboard widgets (StatsCard, SalesChart, etc.), auth (AuthProvider, AuthLayout)
- Global styles in `src/app/globals.css` with custom color tokens

### Backend Services (`api/`)
- `api/ai_api/` - Python FastAPI service
- `api/grpc/` - Go gRPC service
- `api/web_api/` - TypeScript Web API with user endpoints

### Database
- Prisma schema: `prisma/schema.prisma`
- Connection: MySQL (default: `mysql://root:root123@localhost:3306/ai_admin`)
- Configure via `.env` and `prisma.config.ts`

### Design System
- Color tokens defined in `globals.css`: `--primary-blue`, `--success-green`, `--warning-yellow`, `--danger-red`, `--info-cyan`, `--text-muted`
- Background: `#f4f6f9`
- AdminLTE-inspired layout: fixed sidebar (250px), fixed navbar (57px)

### Authentication
- Client-side auth using `localStorage` (`isLoggedIn` key)
- AuthProvider context wraps the app
- AuthLayout handles redirect logic

## Figma MCP Integration Rules

When implementing designs from Figma, follow this workflow:

1. Run `get_design_context` to fetch the structured representation for the exact node(s)
2. If response is truncated, run `get_metadata` then re-fetch required nodes with `get_design_context`
3. Run `get_screenshot` for visual reference
4. Translate output to project conventions - reuse existing components and color tokens
5. Validate against Figma for 1:1 look and behavior

**Implementation rules:**
- Treat Figma output as design reference, not final code
- Replace Tailwind utilities with project design-system tokens
- Reuse existing components instead of duplicating
- Use project's color system and typography consistently
