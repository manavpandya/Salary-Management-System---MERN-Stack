# Salary Management System

A production-quality web application for managing 10,000 employees with salary analytics. Built with React, Express, Prisma, and SQLite.

## Features

- **Employee Management** — Full CRUD operations with search, filter, sort, and pagination
- **Salary Insights** — Min, max, and average salary grouped by country and job title
- **Responsive UI** — Clean, accessible interface built with Tailwind CSS

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| UI | Tailwind CSS v4 + Lucide React icons |
| State | TanStack React Query |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma |
| Database | SQLite |
| Testing | Vitest (frontend) / Jest + Supertest (backend) |

## Prerequisites

- Node.js 18+
- npm

## Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd salary_management_system_mern_stack

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
# backend/.env (already created for you)
DATABASE_URL="file:./prisma/dev.db"
PORT=3001
```

### 3. Run database migrations

```bash
cd backend
npx prisma migrate dev
```

### 4. Seed the database (10,000 employees)

```bash
cd backend
npm run db:seed
```

### 5. Start the application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173) with API proxied to `localhost:3001`.

## Running Tests

```bash
# Backend (19 tests)
cd backend
npm test

# Frontend (5 tests)
cd frontend
npx vitest run
```

## API Endpoints

### Employees
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | List employees (pagination, filter, sort) |
| GET | `/api/employees/:id` | Get single employee |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/employees/countries` | List distinct countries |
| GET | `/api/employees/job-titles` | List distinct job titles |

### Insights
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/insights/by-country` | Min/max/avg salary per country |
| GET | `/api/insights/by-job-title` | Avg salary by job title (optional `?country=`) |

### Query Parameters for `GET /api/employees`

- `page` — Page number (default: 1)
- `limit` — Items per page (default: 20, max: 100)
- `search` — Full name search
- `country` — Filter by country
- `jobTitle` — Filter by job title
- `sortBy` — Sort field (`fullName`, `jobTitle`, `country`, `salary`, `createdAt`)
- `sortOrder` — Sort direction (`asc`, `desc`)

## Project Structure

```
├── backend/
│   ├── prisma/          # Schema, migrations, seed script
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # Route definitions
│   │   ├── middleware/   # Validation and error handling
│   │   ├── validators/  # Zod schemas
│   │   └── types/       # TypeScript interfaces
│   └── tests/           # API tests
│
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios API clients
│   │   ├── hooks/       # React Query hooks
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components
│   │   └── types/       # TypeScript interfaces
│   └── tests/           # Component tests
│
└── README.md
```

## Deployment

**Backend:** Deploy to Railway/Render. Set `DATABASE_URL` environment variable.
**Frontend:** Build with `npm run build` and deploy to Vercel/Netlify. Set Vite proxy or configure CORS for production API URL.