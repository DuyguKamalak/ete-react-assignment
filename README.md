# ETE — Company & Product Management

[![CI](https://github.com/DuyguKamalak/ete-react-assignment/actions/workflows/ci.yml/badge.svg)](https://github.com/DuyguKamalak/ete-react-assignment/actions/workflows/ci.yml)

**🌐 Live demo: https://ete-portal-five.vercel.app** — log in with `admin` / `admin123`

A full-stack application for managing companies and their products. It features JWT
authentication, a live statistics dashboard, and full CRUD with sorting, filtering,
searching, pagination and CSV export.

Built as a technical assignment, covering every required feature plus all listed bonuses.

---

## Tech Stack

| Layer     | Technologies                                                            |
| --------- | ----------------------------------------------------------------------- |
| Frontend  | React 18, TypeScript, Vite, Ant Design v5, React Router, TanStack Query, Recharts |
| Backend   | Node.js, Express, TypeScript, Sequelize ORM                             |
| Database  | PostgreSQL 16 (via Docker Compose)                                       |
| Auth      | JWT (`jsonwebtoken`) + `bcryptjs`                                        |
| Testing   | Jest + supertest (backend), Vitest + React Testing Library (frontend)   |

---

## Features

**Core**

- Login / Register with JWT authentication
- Dashboard with dynamic statistics (totals, latest companies) and charts
- Companies table — full CRUD (Name, Legal Number, Incorporation Country, Website)
- Products table — full CRUD (Name, Category, Amount, Amount Unit, Company relation)

**Bonuses implemented**

- ✅ Table sorting, filtering, searching and pagination
- ✅ Node.js + Express backend serving all data
- ✅ PostgreSQL with Sequelize ORM (relational schema, FK + cascade)
- ✅ Unit & integration tests (backend and frontend)
- ✅ JWT token authentication with hashed passwords
- ✅ TypeScript across the entire stack
- ✅ Extra features: live dashboard charts, dark/light theme, CSV export,
  responsive layout, toast notifications, confirmation dialogs

---

## Prerequisites

- **Node.js** >= 18
- **Docker** + Docker Compose (for PostgreSQL)

> Don't have Docker? Any local PostgreSQL 16 instance works — just point the
> `server/.env` values at it.

---

## Option A — Run everything with Docker (one command)

This builds the frontend, backend and database, runs the migrations, seeds demo
data, and serves the whole app behind nginx:

```bash
git clone https://github.com/DuyguKamalak/ete-react-assignment.git
cd ete-react-assignment
docker-compose up --build
```

- App → http://localhost:8080
- API → http://localhost:4000

Log in with the seeded demo account (`admin` / `admin123`) or register a new one.

---

## Option B — Local development

```bash
# 1. Clone and enter the project
git clone https://github.com/DuyguKamalak/ete-react-assignment.git
cd ete-react-assignment

# 2. Start only PostgreSQL in Docker
docker-compose up -d postgres

# 3. Configure the backend environment
cp server/.env.example server/.env

# 4. Install all dependencies (npm workspaces)
npm install

# 5. Seed demo data (creates the admin user + sample companies/products)
npm run seed

# 6. Run backend + frontend together
npm run dev
```

- Frontend → http://localhost:5173
- Backend API → http://localhost:4000

> **Database schema:** In local development the schema is auto-synced from the
> Sequelize models. The Docker image instead applies versioned **migrations**
> (`server/migrations`) and **seeders** (`server/seeders`) via `sequelize-cli` —
> run them manually with `npm run db:migrate` and `npm run db:seed` if needed.

---

## Deployment (live demo)

The app is deployment-ready for a **Vercel (frontend) + Render (backend & PostgreSQL)** setup:

- **Backend & database — Render:** the [`render.yaml`](./render.yaml) blueprint provisions
  a Dockerized API service and a managed PostgreSQL instance. On first boot the container
  runs the migrations and seeders automatically. Set `CLIENT_ORIGIN` to the Vercel URL.
- **Frontend — Vercel:** import the repo with **Root Directory = `client`**. Vite is
  detected automatically ([`client/vercel.json`](./client/vercel.json) adds SPA routing).
  Set the env var `VITE_API_URL` to the Render API URL plus `/api`.
- **No cold starts:** the [`keep-alive`](./.github/workflows/keep-alive.yml) workflow pings
  the backend every 10 minutes. Add a repository variable `BACKEND_URL` with the Render URL.
  (For extra reliability you can also use a free uptime monitor.)

---

## Running Tests

```bash
npm test                       # run backend + frontend test suites

npm test --workspace server    # backend only (Jest + supertest)
npm test --workspace client    # frontend only (Vitest)
```

The backend test suite runs against an in-memory SQLite database, so **no running
PostgreSQL is required to execute the tests**.

---

## API Overview

| Method | Endpoint              | Description                         | Auth |
| ------ | --------------------- | ----------------------------------- | ---- |
| POST   | `/api/auth/register`  | Create an account, returns a JWT    | —    |
| POST   | `/api/auth/login`     | Log in, returns a JWT               | —    |
| GET    | `/api/companies`      | List companies                      | ✓    |
| POST   | `/api/companies`      | Create a company                    | ✓    |
| PUT    | `/api/companies/:id`  | Update a company                    | ✓    |
| DELETE | `/api/companies/:id`  | Delete a company (cascades products)| ✓    |
| GET    | `/api/products`       | List products (with company)        | ✓    |
| POST   | `/api/products`       | Create a product                    | ✓    |
| PUT    | `/api/products/:id`   | Update a product                    | ✓    |
| DELETE | `/api/products/:id`   | Delete a product                    | ✓    |
| GET    | `/api/stats`          | Dashboard aggregates                | ✓    |

---

## Architecture & Design Choices

- **Monorepo with npm workspaces** keeps the frontend and backend in one repository
  with a single install and unified scripts, while staying clearly separated.

- **Layered backend** (`routes → controllers → services → models`). Business logic
  lives in services, keeping controllers thin and the logic easy to unit-test. Input
  is validated with **Zod** schemas and errors flow through a single error-handling
  middleware that maps validation, not-found and conflict cases to proper HTTP codes.

- **Sequelize models** define a relational schema where a `Product` belongs to a
  `Company` (foreign key with `ON DELETE CASCADE`), so removing a company cleanly
  removes its products.

- **Environment-aware database**: PostgreSQL in development/production, and an
  in-memory SQLite database for tests — giving fast, isolated, dependency-free tests.
  The Docker image manages the schema with versioned **Sequelize migrations** and
  **seeders** (idempotent), rather than model auto-sync.

- **Containerized**: multi-stage Dockerfiles build a slim backend image and an
  nginx-served frontend; a single `docker-compose up` brings up the database,
  runs migrations + seeders, and serves the app.

- **Server state with TanStack Query** on the frontend handles fetching, caching and
  cache invalidation. Mutations invalidate the relevant queries, so the dashboard and
  tables stay automatically in sync after every create/update/delete.

- **Filtering, searching, sorting and pagination are done client-side** — a deliberate
  choice for this dataset's scale. Each table loads its full collection once (cached by
  TanStack Query) and derives the view with memoized selectors, which keeps interactions
  instant, lets CSV export cover the full filtered set, and reuses the same in-memory
  list for the related dropdowns (e.g. the company filter and the product form) without
  extra round-trips. The natural path to scale is to move this work to the server:
  `GET /products?page&pageSize&search&sort` backed by Sequelize `findAndCountAll`
  (`limit`/`offset`/`where`/`order`) returning `{ rows, total }`, a lightweight
  `options` endpoint for the dropdowns, and an unpaginated export route — swapped in
  behind the existing query hooks without touching the UI components.

- **JWT auth** is stored client-side and attached by an Axios interceptor; a response
  interceptor logs the user out on `401`. Routes are guarded by a `ProtectedRoute`.

- **Ant Design v5** provides the component library (as suggested), themed through a
  `ConfigProvider` that supports a live dark/light toggle.

---

## Project Structure

```
ete-react-assignment/
├── client/                      # React + TypeScript + Vite + Ant Design
│   └── src/
│       ├── api/                 # Axios instance + resource clients
│       ├── components/          # Layout, ProtectedRoute
│       ├── context/             # Auth & theme providers
│       ├── pages/               # Login, Dashboard, Companies, Products
│       └── utils/               # CSV export helper
├── server/                      # Express + TypeScript + Sequelize
│   ├── migrations/              # Sequelize CLI schema migrations
│   ├── seeders/                 # Sequelize CLI demo-data seeders
│   ├── Dockerfile               # Multi-stage backend image
│   └── src/
│       ├── config/              # Environment configuration
│       ├── controllers/         # HTTP handlers
│       ├── db/                  # Sequelize instance + seed script
│       ├── middleware/          # Auth + error handling
│       ├── models/              # User, Company, Product
│       ├── routes/              # Route definitions
│       ├── services/            # Business logic
│       └── validators/          # Zod schemas
├── docker-compose.yml           # PostgreSQL + backend + frontend
└── package.json                 # npm workspaces root
```
