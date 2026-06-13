# ETE — Company & Product Management

A full-stack application for managing companies and their products, featuring JWT
authentication, a live statistics dashboard, and full CRUD with sorting, filtering,
searching and pagination.

> Full setup, run and architecture documentation will be completed as the project
> progresses. See the plan below for the intended scope.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Ant Design v5, React Router, TanStack Query
- **Backend:** Node.js, Express, TypeScript, Sequelize ORM
- **Database:** PostgreSQL 16 (via Docker Compose)
- **Auth:** JWT + bcrypt
- **Testing:** Jest (backend), Vitest (frontend)

## Project Structure

```
ete-react-assignment/
├── client/             # React + TypeScript + Vite + Ant Design
├── server/             # Express + TypeScript + Sequelize + PostgreSQL
├── docker-compose.yml  # PostgreSQL service
└── package.json        # npm workspaces root
```

## Quick Start (preview)

```bash
docker-compose up -d   # start PostgreSQL
npm install            # install all workspace dependencies
npm run seed           # seed demo data (admin / admin123)
npm run dev            # run backend + frontend
```
