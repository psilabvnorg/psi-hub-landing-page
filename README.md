# LANDING-PSI

A React landing page built with Vite, TypeScript, Tailwind CSS v3, and shadcn/ui components.

## Stack

- **React 19** with TypeScript
- **Vite 7** — dev server and build tool
- **Tailwind CSS v3** with shadcn theme
- **shadcn/ui** — 40+ pre-built Radix UI components
- **React Hook Form** + Zod — form handling and validation
- **Recharts** — charting
- **Lucide React** — icons

## Project Structure

```
src/
  sections/       Page sections (Hero, Products, ProductCard, Contact, Footer)
  components/     UI components (shadcn/ui)
  hooks/          Custom React hooks
  types/          TypeScript type definitions
  App.tsx         Root component
  main.tsx        Entry point
index.html        HTML entry point
vite.config.ts    Vite configuration
tailwind.config.js Tailwind theme/plugins
```

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Component Usage

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
```

## Requirements

- Node.js 20+
