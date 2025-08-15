# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Graph POS Client** - a comprehensive Point of Sale (POS) system frontend built with React, TypeScript, and GraphQL. It's a multi-tenant SaaS application covering inventory management, accounting, people management, and reporting modules.

## Development Commands

### Core Development
```bash
# Start development server (runs on localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (ESLint with TypeScript rules)
npm run lint

# Generate GraphQL types from schema
npm run generate:gql
```

### GraphQL Code Generation
- Run `npm run generate:gql` after any GraphQL query/mutation changes
- Generated files are in `src/commons/graphql-models/`
- Schema endpoint: `http://localhost:9856/graphql` (configurable in codegen.config.ts)

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: React Hook Form + Apollo Client cache + Jotai atoms
- **GraphQL**: Apollo Client with code generation
- **UI Framework**: Mantine + Tailwind CSS + shadcn/ui components
- **Routing**: React Router v7 with file-based structure
- **Forms**: React Hook Form + Yup validation

### Module Structure
The application follows a **multi-tenant, multi-module architecture**:

```
src/pages/(tenant)/
├── inventory-management/    # POS, products, invoices, purchases
├── accounting/             # Cashbook, payroll, expenses
├── people/                # Clients, employees, suppliers
├── reports/               # Financial and summary reports
└── tenant-settings/       # Organization settings, users, roles
```

### Key Architectural Patterns

#### 1. Module-Based Organization
Each business module has its own:
- `module-root.page.tsx` - Module entry point
- `*.navlinks.tsx` - Navigation configuration
- `*.router.tsx` - Module routing
- `pages/` - Feature pages
- `components/` - Shared module components
- `utils/` - Business logic and queries

#### 2. GraphQL Integration
- **Schema-first development** with automatic type generation
- **Apollo Client** for caching and state management
- **Query files** in `utils/` directories contain GraphQL operations
- **Fragment masking** for type safety

#### 3. Form Management Pattern
- **React Hook Form** for form state
- **Yup schemas** for validation (in `utils/validations/`)
- **Common form components** in `src/commons/components/`

#### 4. Tenant-Based Routing
- Routes: `/:tenant/module/feature`
- **Tenant resolution** via `tenant-resolver-for-apollo.tsx`
- **Route guards** for authentication/authorization

## Key Directories & Files

### Core Configuration
- `src/commons/clients/apollo.client.ts` - GraphQL client setup
- `src/commons/configs/codegen.config.ts` - GraphQL code generation
- `src/root.router.tsx` - Application routing
- `vite.config.ts` - Development server proxy to localhost:9856

### State Management
- `src/commons/states/` - Jotai atoms for global state
- Apollo Client cache for GraphQL data
- React Hook Form for local form state

### Shared Components
- `src/commons/components/` - Reusable UI components
- `src/commons/shadcn/` - shadcn/ui component library
- `src/commons/components/layouts/` - Layout components

### Business Logic
- Each module's `utils/` contains GraphQL queries and business logic
- `src/commons/utils/` contains shared utilities
- Form validation schemas in `validations/` subdirectories

## Development Patterns

### Adding New Features
1. **Navigate to appropriate module** in `src/pages/(tenant)/[module]/`
2. **Create page component** in `pages/[feature]/`
3. **Add GraphQL operations** in `utils/` directory
4. **Run `npm run generate:gql`** to update types
5. **Update module router** and navigation links
6. **Add validation schema** if forms are involved

### GraphQL Workflow
1. **Write queries/mutations** in component files or utils
2. **Run code generation**: `npm run generate:gql`
3. **Import generated types** from `@/commons/graphql-models`
4. **Use with Apollo hooks**: `useQuery`, `useMutation`

### Form Development
1. **Create Yup validation schema** in `utils/validations/`
2. **Use React Hook Form** with `useForm` hook
3. **Apply validation** with `@hookform/resolvers/yup`
4. **Use common form components** from `commons/components`

## Important Technical Details

### Proxy Configuration
- Development server proxies `/api`, `/socket`, `/graphql` to `localhost:9856`
- Backend API assumed to run on port 9856
- GraphQL endpoint: `/graphql`

### Code Generation
- GraphQL types generated to `src/commons/graphql-models/`
- Scans all `.tsx` files for GraphQL operations
- Includes fragment masking for type safety

### Module System
- **Tenant-scoped routing**: `/:tenant/module/feature`
- **Module navigation** via `*.navlinks.tsx` files
- **Nested routing** with React Router v7

### State Management Strategy
- **Local component state**: React useState/useReducer
- **Form state**: React Hook Form
- **Global UI state**: Jotai atoms
- **Server state**: Apollo Client cache
- **Authentication**: Token-based with RouteGuardWrapper

### POS System Specifics
The core POS functionality is in `inventory-management/pages/pos/`:
- **Real-time product search** with stock validation
- **Client assignment** and transaction management
- **Hold/resume transactions** with reference numbers
- **Multi-payment support** with change calculation
- **Invoice generation** with printing capabilities

## Environment Variables
- `VITE_API_URL` - Backend API URL (defaults to localhost:9856)
- See `src/commons/configs/codegen.config.ts` for GraphQL schema URL

## Testing & Quality
- **ESLint** configured with TypeScript rules
- **Strict TypeScript** configuration
- **No test framework** currently configured
- **Type safety** enforced through GraphQL code generation

## Multi-Tenant Considerations
- **Tenant context** resolved from URL parameter
- **Tenant-scoped data** via GraphQL context
- **Role-based permissions** managed in tenant-settings
- **Organization switching** via select-organization page