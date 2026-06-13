#!/bin/sh
set -e

echo "Running database migrations..."
npm run db:migrate

echo "Seeding database (idempotent)..."
npm run db:seed

echo "Starting API server..."
exec node dist/index.js
