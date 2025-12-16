# Copilot Instructions for Simple EJS HTML Page

## Project Overview
React + TypeScript + Vite app for a document management system (DMS) with approval workflows. The app manages Documents, Users, Sectors, and Approval Flows through a tabbed interface.

**Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI components, Recharts for dashboards, Lucide icons

## Architecture Patterns

### CRUD + Service Layer Pattern
All entities follow a consistent pattern:
- **Types** (`src/app/types/`): Interface definitions (Documento, Usuario, Setor, FluxoAprovacao)
- **Services** (`src/app/services/api.ts`): CRUD operations for each entity with async methods (findAll, findById, create, update, delete)
- **Components**: List and Form pairs for each entity (e.g., DocumentoList + DocumentoForm)

Example service structure:
```typescript
export const documentoService = {
  async findAll(): Promise<Documento[]> { /* GET /documentos */ },
  async create(documento: Documento): Promise<Documento> { /* POST /documentos */ }
}
```

### App.tsx State Management
Central state holder with parallel tabs (dashboard, documentos, usuarios, setores, fluxos). Uses useState for:
- Entity data: `[documentos, setDocumentos]`
- Form visibility: `[showDocumentoForm, setShowDocumentoForm]`
- Edit state: `[editingDocumento, setEditingDocumento]`

Data loading via `loadData()` which switches on activeTab and loads only necessary data.

### Component Organization
- **List Components**: Display tabular data, handle delete/edit triggering
- **Form Components**: Controlled inputs, validation, create/update logic
- **Dashboard**: Aggregates stats across all entities, renders Recharts visualizations (PieChart, BarChart, LineChart)
- **UI Components** (`src/app/components/ui/`): Radix UI wrappers (button, dialog, form, input, table, etc.)

## Critical Developer Workflows

### Build & Development
```bash
npm install        # Install dependencies
npm run dev        # Start Vite dev server (hot reload)
npm run build      # Production build
```

### API Integration
- API base URL: `http://localhost:8080` (configurable in `src/app/services/api.ts`)
- All services use fetch API with JSON Content-Type
- Error handling: throws on !response.ok
- Mock fallback: App.tsx catches API errors and uses mock data (lines ~90)

### Adding New Entity Types
1. Create type in `src/app/types/{entity}.ts` with required interface
2. Add CRUD service in `src/app/services/api.ts` following documentoService pattern
3. Create `{Entity}List.tsx` and `{Entity}Form.tsx` in `src/app/components/`
4. Add tab case to App.tsx switch statement for data loading
5. Add tab button with Lucide icon

## Styling & Design System

- **Tailwind CSS**: Primary utility framework; all components use Tailwind classes
- **UI Library**: Radix UI primitives wrapped with shadcn/ui style (in `src/app/components/ui/`)
- **Icons**: Lucide React (e.g., `<FileText />`, `<Plus />`)
- **Dark Mode**: next-themes configured (see package.json)
- **Responsive**: Tailwind breakpoints (responsive design first)

All custom CSS in `src/styles/` (fonts.css, theme.css, tailwind.css, index.css)

## Key File References

| File | Purpose |
|------|---------|
| [src/app/App.tsx](src/app/App.tsx) | Main app shell, state management, tab routing |
| [src/app/services/api.ts](src/app/services/api.ts) | All backend service calls |
| [src/app/components/Dashboard.tsx](src/app/components/Dashboard.tsx) | Analytics charts and summary stats |
| [vite.config.ts](vite.config.ts) | Vite + React + Tailwind setup; `@` alias points to `/src` |
| [guidelines/Guidelines.md](guidelines/Guidelines.md) | Design system (currently template) |

## Important Notes

- **Vite Config**: Both React and Tailwind plugins required even if not actively used (do not remove)
- **Path Alias**: Use `@/` to import from src (e.g., `import { Button } from '@/components/ui/button'`)
- **Language**: Portuguese (pt-br) throughout codebase
- **Figma Origin**: This is a Figma design export; package.json name is `@figma/my-make-file`
