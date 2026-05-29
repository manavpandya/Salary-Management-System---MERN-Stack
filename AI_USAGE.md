# AI Usage Documentation

This document tracks all prompts used, engineering decisions, tradeoffs, and corrections made during development.

---

## Original Assignment Prompt

You are a senior full stack engineer.

Build a minimal yet production-quality Salary Management Tool for an organization with 10,000 employees.

The goal is to create a clean, maintainable, scalable, and fully functional application without overengineering.

Tech Stack:
- Frontend: React.js or Next.js
- Backend: Node.js + Express/NestJS (preferred) or equivalent
- Database: SQLite (preferred relational DB)
- ORM: Prisma/Sequelize optional
- UI Library: Your choice
- Testing: Your preferred testing framework

Core Requirements:

1. Employee Management — Implement complete CRUD operations via UI (Add, View, Update, Delete). Fields: Full Name, Job Title, Country, Salary (plus small practical fields if necessary).

2. Salary Insights — Implement salary analytics via UI: Min, max, avg salary by country; avg salary for a given job title within a country. No unnecessary analytics.

3. Backend — REST APIs, proper validation, error handling, clean folder structure, scalable architecture for 10,000 employees, relational database design best practices.

4. Frontend — Responsive UI, clean UX, reusable components, state management, search/filtering/sort/pagination, loading/error states.

5. Database Seeding — 10,000 employees using first_names.txt + last_names.txt. Optimize insertion. Realistic sample data. Rerunnable safely.

6. Performance — Efficient queries, pagination, filtering, sorting, optimized rendering. No enterprise-level optimizations.

7. Testing — Meaningful tests for business logic, APIs, critical UI. Fast, deterministic, maintainable.

8. Deployment — Deployed frontend/backend, README with setup instructions, environment setup, video demo.

9. AI Usage — Document prompts used, engineering decisions, tradeoffs, validation/corrections.

10. Commit History — Incremental, meaningful commits.

Constraints: Do not overengineer, no unnecessary features, no microservices, no auth unless required, prioritize correctness, maintainability, readability, clean architecture.

---

## Incremental Development Prompts

### Phase 1: Project Setup & Backend

**Prompt 1:** *"Build a minimal yet production-quality Salary Management Tool for an organization with 10,000 employees"*
**Result:** Full architecture plan, tech stack selection (React + Express + Prisma + SQLite), folder structure, incremental implementation plan.

**Prompt 2:** *"Create Express backend with Prisma ORM, SQLite, Zod validation, and REST APIs for employee CRUD"*
**Result:**
- Prisma schema with indexes on `country`, `jobTitle`, and composite `(country, jobTitle)`
- Full CRUD service layer (routes → controllers → services)
- Zod validation schemas for create, update, and query params
- Centralized error handling middleware (Zod + AppError)
- Salary insights via Prisma `groupBy` queries

**Validation/Fixes:**
- Fixed `req.params.id` type (Express v5 changed to `string | string[]`)
- Fixed import paths for `CreateEmployeeInput`/`UpdateEmployeeInput`

---

### Phase 2: Frontend

**Prompt 3:** *"Build React frontend with employee list (search, filter, sort, pagination) and salary insights"*
**Result:**
- EmployeeTable with sortable column headers
- EmployeeFilters with search input, country/job title dropdowns
- EmployeeForm with validation and pre-fill for editing
- InsightsPage with country summary and job title breakdown
- TanStack Query hooks for all API calls

**Validation/Fixes:**
- Fixed form labels to use `htmlFor` attributes (accessibility + test compatibility)

---

### Phase 3: Database Seeding

**Prompt 4:** *"Create seed script for 10,000 employees with first/last name files, optimized performance"*
**Result:**
- Reads `first_names.txt` (~460 names) × `last_names.txt` (~470 names) = 216,200 unique combinations
- 20 countries with cost-of-living salary multipliers
- 30 job titles with realistic salary ranges ($45k–$280k USD)
- Batch insertion (2,000 records per batch)

---

### Phase 4: Testing

**Prompt 5:** *"Write meaningful tests for APIs and critical UI functionality"*
**Result:**
- Backend: 19 API tests (CRUD, validation, 404s, pagination, sorting, filtering, insights)
- Frontend: 5 component tests (render, validation, submit, pre-fill, cancel)

**Validation/Fixes:**
- Tests initially conflicted with seed data. Fixed by using `TEST_` prefix in test records and only cleaning test-specific data in `afterAll`.

---

### Phase 5: Code Quality Optimization

**Prompt 6:** *"Push initial set of changes for front-end. Make sure base changes work locally before pushing. Code clean-up and optimization. Every incremental commit should be tested locally. Clean up vite-boilerplate."*
**Result:**
- Removed Vite boilerplate files
- Verified all builds and tests locally before pushing
- Added proper `.gitignore` for both projects

---

### Phase 6: Insights Page Optimization

**Prompt 7:** *"Optimize salary insight page — pagination (shows all records), UI adjustments, interactivity with table columns (sorting/filtering)"*
**Result:**
- Added pagination to `/api/insights/by-job-title` (page, limit params)
- Added `/api/insights/stats` endpoint for overall metrics
- Added sortable column headers with visual indicators
- Added client-side text search filter
- Added summary stat cards (total employees, avg salary, countries, job titles)
- Updated Axios API and React Query hooks for paginated responses
- Fixed tests for new paginated response format

---

### Phase 7: Bug Audit & Fixes

**Prompt 8:** *"Check for any major issues and bottlenecks in this app, just list out, don't resolve it"*
**Result:** Identified 10 critical issues:

| # | Issue | Severity |
|---|---|---|
| 1 | Case-sensitive search | Critical |
| 2 | Debounce timeout leak on unmount | Critical |
| 3 | Offset pagination performance at deep pages | Performance |
| 4 | Uncached aggregate queries | Performance |
| 5 | Dual groupBy queries | Performance |
| 6 | No request timeout | Architecture |
| 7 | No startup DB validation | Architecture |
| 8 | No React Error Boundary | Architecture |
| 9 | Tightly coupled hooks | Architecture |
| 10 | No input sanitization | Security |

**Prompt 9:** *"Fix all 10 issues"*
**Result:** All 10 issues resolved:
- Input sanitization: control chars stripped, max 100 chars, sort params validated against whitelist
- Debounce cleanup: `useEffect` return clears timeout on unmount
- Page cap: `Math.min(page, 1000)` prevents deep OFFSET
- Request timeout: 30s `res.setTimeout()` returning 503
- Startup validation: `SELECT 1` via shared Prisma instance
- Error Boundary: Class component wrapping each page tab
- Dual groupBy: single query + in-memory pagination (< 600 rows)
- In-memory cache: 60s TTL for all aggregate endpoints
- CORS configurable via `CORS_ORIGIN` env variable
- JSON body limit: 1MB

**Validation/Fixes:**
- `validateDatabase()` initially created separate PrismaClient (conflicted with singleton). Fixed by using shared instance.
- `SELECT 1` used `$executeRawUnsafe` (not allowed for SQLite SELECT). Fixed to `$queryRawUnsafe`.

---

### Phase 8: Code Cleanup

**Prompt 10:** *"Code/repo clean-up — unused imports, commented code, formatting, comments, hardcoded values, linter, dependencies"*
**Result:**
- Removed unused code: `ApiError` interface, `insightQuerySchema`, `EmployeeListQueryInput` type, `TableId` type, `BarChart3`/`JobTitleInsight` imports
- Extracted `parseId()` helper to eliminate repeated parseInt/isNaN
- Simplified complex `ReturnType<typeof...>` generic to plain interface
- Typed catch blocks with `(err as Error)` for TypeScript strict compliance
- Created shared Axios client instance (`api/client.ts`)
- Added JSDoc comments to all API functions
- Deduplicated `axios.create` calls across API files

---

## Engineering Decisions & Tradeoffs

### Backend Architecture
| Decision | Rationale |
|---|---|
| **Prisma + SQLite** | Zero-config relational DB. Type safety prevents runtime errors. Handles 10k records easily. |
| **Service layer** | Business logic testable and independent of Express request/response. |
| **Zod over class-validator** | Lighter, functional approach. Better TypeScript inference. |
| **Offset pagination** | Simpler than cursor-based. Page capped at 1000 for performance. |
| **Prisma groupBy** | Single query for min/max/avg vs multiple raw queries. Indexed fields ensure fast aggregations. |
| **In-memory cache** | 60s TTL cache for aggregate queries. Simple, no external dependencies. |
| **Shared Prisma singleton** | Prevents connection proliferation across service modules. |

### Frontend Architecture
| Decision | Rationale |
|---|---|
| **TanStack Query** | Built-in caching, refetching, loading/error states. Eliminates manual state management. |
| **Tailwind CSS v4** | Utility-first, no runtime, fast development. |
| **No routing library** | Simple tab navigation sufficient for 2 pages. Avoids unnecessary dependency. |
| **Debounced search (300ms)** | Prevents excessive API calls while maintaining responsiveness. |
| **Shared Axios client** | Single configuration point for all API calls. Consistent error handling. |
| **ErrorBoundary per tab** | Page-level error isolation prevents full-app crashes. |

### Database Design
| Decision | Rationale |
|---|---|
| **Composite index (country, jobTitle)** | Optimizes most common insight query. |
| **Individual indexes** | Country and jobTitle filters used independently in employee listing. |
| **WAL mode** | Enables concurrent reads while writing. |

### Security
| Decision | Rationale |
|---|---|
| **Input sanitization** | Strips control chars, limits to 100 chars. Prevents injection patterns. |
| **Sort whitelist** | Only valid column names accepted. Prevents injection into ORDER BY. |
| **JSON body limit (1MB)** | Prevents payload flooding attacks. |
| **Configurable CORS** | `CORS_ORIGIN` env variable for production restriction. |

---

## Corrections Made to AI-Generated Code

1. **Express v5 `req.params` type** — Changed to `string | string[]`. Fixed with `as string` cast.

2. **Service import paths** — `CreateEmployeeInput`/`UpdateEmployeeInput` exported from `validators` not `types`.

3. **Test database contamination** — Insights tests conflicted with seed data. Fixed by using `TEST_` prefix.

4. **Form accessibility** — Labels lacked `htmlFor` attributes. Added for screen reader and test compatibility.

5. **Vitest mock hoisting** — `vi.mock()` calls must be before imports. Fixed mock placement.

6. **Prisma `SELECT` with `$executeRawUnsafe`** — Not allowed for queries that return results. Fixed to `$queryRawUnsafe`.

7. **Duplicate PrismaClient instances** — `validateDatabase()` created separate instance conflicting with singleton. Fixed by reusing shared instance.

8. **Complex generic type** — `ReturnType<typeof getTotalSalaryStats> extends Promise<infer T> ? T : never` replaced with plain inline interface.

---

## Commit History

```
feea0b6 chore: code cleanup and quality improvements
7e1186b fix: resolve 10 critical issues from audit
c2fa864 feat: enhance Insights page with pagination, sorting, search, and summary stats
1ba6f9f refactor: optimize code quality, performance, and test determinism
5fd379b docs: add README with setup instructions and AI_USAGE documentation
873a5d7 test: add frontend tests for EmployeeForm with vitest + RTL, fix form accessibility
dd6ecbf feat: implement Employees page and Salary Insights page with full UI
9524ddc feat: initialize frontend with Vite, React, Tailwind CSS, React Query setup
e26910d fix: resolve TypeScript type issues in employee controller and service imports
8d773b2 test: add comprehensive API tests for employees and insights endpoints
67894c2 feat: implement Employee CRUD and Salary Insights APIs with Zod validation and error handling
433544d chore: initialize backend project with Express, Prisma, and SQLite setup
4d922a5 chore: initialize base project configuration

## Some PROMPT examples:

2. Next steps:

- Push initial set of changes for the front-end 
- Make sure the base changes are config are working locally before pushing a commit
- Code clean-up and optimization should be taken care
- Every incremental commit should be tested locally and then push
- Clean-up vite-boilerplate app and remove un-used stuff

3. As per the given instruction, re-check:

- Code optimization feasibility with existing changes
- Backend seed setup effectiveness
- Test cases adjustments
- Data-validation issues
- Code best practices to effectively handle 10,000 employee records

4. Next task is: Optimize salary insight page

- Can we have optimized the records pagination as it shows all the records in one go
- UI adjustments if needed
- Interactivity with the table columns such as sorting/filtering

5. Some issues has been observed by me and should be fixed:

- Case-sensitive search — `employeeService.ts` uses `{ contains: search }` for SQLite, which is case-sensitive. Searching "smith" won't find "Smith". Prisma SQLite doesn't support `mode: 'insensitive'` — would need raw SQL with `COLLATE NOCASE`.
- Debounce timeout leak — `EmployeesPage.tsx` sets a 300ms timeout in `handleSearchChange` but never clears it on component unmount via `useEffect` cleanup.
- Offset pagination at deep page numbers — `OFFSET 9980` (page 500) would be ~10x slower than page 1. Cursor-based pagination would be O(1) regardless of page depth.
- Uncached aggregate queries — `/api/insights/by-country` runs a full `GROUP BY` on every request. Fine at 10k rows (~2ms) but wouldn't scale past 500k without caching.
- Dual groupBy queries — `/api/insights/by-job-title` runs two `groupBy` queries (one for data, one for count). Could use `sqlite_row_count` or estimate.
- No request timeout — Slow SQLite queries could hang requests indefinitely.
- No startup validation — App starts successfully even if DB file is missing (Prisma lazy connects).
- No React Error Boundary — Any component crash results in white screen. Should wrap app with `<ErrorBoundary>`
- Tightly coupled hooks — `useEmployees`/`useInsights` depend directly on `@tanstack/react-query`, making isolated testing harder.
- No input sanitization on search — Employee names with special characters in the search field become part of a SQL LIKE/contains pattern.

6. Next step is for code/repo clean-up:

- Check for any unused imports and remove them
- Remove any commented-out code that is no longer needed
- Ensure consistent code formatting across the project
- Update README with any new setup instructions or changes
- Add comments to complex code sections for better readability
- Remove any placeholder or boilerplate code that is not being used
- Ensure all dependencies in package.json are necessary and up-to-date
- Check for any hardcoded values and replace them with config variables if needed
- Run a linter to catch any potential issues and enforce code style
- Ensure all test cases are passing and add any missing tests for new features or changes