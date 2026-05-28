# AI Usage Documentation

This document tracks prompts, engineering decisions, tradeoffs, and validations made during the development of the Salary Management System.

## Prompts Used

### 1. Project Scaffolding & Architecture
**Prompt:** *"Build a minimal yet production-quality Salary Management Tool for an organization with 10,000 employees"*
**Response:** Generated full architecture plan with specific tech stack choices, folder structure, and incremental implementation plan.

### 2. Backend Implementation
**Prompt:** *"Create Express backend with Prisma ORM, SQLite, Zod validation, and REST APIs for employee CRUD"*
**Response:** Generated:
- Prisma schema with proper indexes on `country`, `jobTitle`, and composite index
- Full CRUD service layer with separation of concerns (routes → controllers → services)
- Zod schemas for request validation (create, update, query params)
- Centralized error handling middleware for both Zod and AppError
- Salary insights aggregate queries using Prisma's `groupBy`

**Validation:** Fixed TypeScript type errors with `req.params.id as string` (Express v5 types changed). Fixed import path for `CreateEmployeeInput`/`UpdateEmployeeInput` (moved from `types` to `validators`).

### 3. Database Seeding
**Prompt:** *"Create seed script for 10,000 employees with first/last name files, optimized performance"*
**Response:** Generated:
- Reads `first_names.txt` (~460 names) and `last_names.txt` (~470 names) - realistic global name sets
- 20 countries with salary multipliers reflecting cost-of-living differences
- 30 job titles with realistic salary ranges
- Batch insertion of 1,000 records at a time using Prisma `createMany`

**Tradeoff:** Using `createMany` with batch size 1,000 vs raw SQL inserts. Batch size was chosen based on Prisma's recommendation — fast enough (~5 seconds for 10k rows) while maintaining type safety.

### 4. Frontend Components
**Prompt:** *"Build React frontend with employee list (search, filter, sort, pagination) and salary insights"*
**Response:** Generated:
- EmployeeTable with sortable column headers
- EmployeeFilters with search input, country/job title dropdowns
- EmployeeForm with validation and pre-fill for editing
- InsightsPage with two tables: country summary and job title breakdown
- TanStack Query hooks for all API calls

**Validation:** Fixed form labels to use `htmlFor` attributes for accessibility and test compatibility. Added React import in test files for JSX transform.

### 5. Testing
**Prompt:** *"Write meaningful tests for APIs and critical UI functionality"*
**Response:** Generated:
- Backend: 19 API tests covering all endpoints, validation, 404s, pagination, filtering, sorting
- Frontend: 5 component tests covering render, validation, submit, pre-fill, and cancel

**Validation:** Tests initially failed due to database contamination (seed data + test data). Fixed by adding `deleteMany()` in `beforeAll`.

## Engineering Decisions & Tradeoffs

### Backend Architecture
| Decision | Rationale |
|---|---|
| **Prisma + SQLite** | Zero-config relational DB. Prisma's type safety prevents runtime errors. SQLite handles 10k records easily. |
| **Service layer** | Keeps business logic testable and independent of Express request/response. |
| **Zod over class-validator** | Lighter, functional approach. Better TypeScript inference. |
| **Offset pagination** | Simpler than cursor-based. Adequate for 10k records with `LIMIT/OFFSET`. |
| **Prisma groupBy** | Single query for min/max/avg vs multiple raw queries. Indexed fields ensure fast aggregations. |

### Frontend Architecture
| Decision | Rationale |
|---|---|
| **TanStack Query** | Built-in caching, refetching, loading/error states. Eliminates manual state management. |
| **Tailwind CSS v4** | Utility-first, no runtime, fast development. |
| **No routing library** | Simple tab navigation is sufficient for 2 pages. Avoids unnecessary dependency. |
| **Debounced search (300ms)** | Prevents excessive API calls while maintaining responsiveness. |
| **Lucide icons** | Lightweight, tree-shakable icon library. |

### Database Design
| Decision | Rationale |
|---|---|
| **Composite index (country, jobTitle)** | Optimizes the most common insight query: "avg salary by job title within country". |
| **Individual indexes** | Country and jobTitle filters are used independently in employee listing. |
| **No foreign keys** | Employee entity is independent. No other entities reference it. |

### Tradeoffs
| Tradeoff | Choice | Alternative Considered |
|---|---|---|
| Database | SQLite (simplicity) | PostgreSQL (if >100k records anticipated) |
| Pagination | Offset-based | Cursor-based (better for real-time updates) |
| State Management | React Query | Redux/Zustand (overkill for this scope) |
| API Validation | Zod middleware | Decorators (class-validator, more verbose) |
| Monorepo | Separate npm packages | Turborepo/Nx (too heavy for 2 packages) |
| Seed performance | createMany batches | Raw SQL inserts (faster but no type safety) |

## Corrections Made to AI-Generated Code

1. **TypeScript `req.params` type** — Express v5 changed `params` type to `string | string[]`. Fixed by adding `as string` cast.

2. **Service imports** — `CreateEmployeeInput`/`UpdateEmployeeInput` were exported from `validators` not `types`. Fixed import path.

3. **Test database contamination** — Insights tests conflicted with seeded data. Added `deleteMany()` before test data insertion.

4. **Form accessibility** — Labels didn't use `htmlFor` attribute. Added for proper screen reader and test compatibility.

5. **Test file mock order** — Vitest requires `vi.mock()` calls to be hoisted before imports. Fixed mock placement.

## Commit History

```
8d773b2 test: add comprehensive API tests for employees and insights endpoints
67894c2 feat: implement Employee CRUD and Salary Insights APIs with Zod validation
433544d chore: initialize backend project with Express, Prisma, and SQLite setup
4d922a5 chore: initialize base project configuration
e26910d fix: resolve TypeScript type issues in employee controller and service imports
9524ddc feat: initialize frontend with Vite, React, Tailwind CSS, React Query setup
dd6ecbf feat: implement Employees page and Salary Insights page with full UI
873a5d7 test: add frontend tests for EmployeeForm with vitest + RTL, fix form accessibility