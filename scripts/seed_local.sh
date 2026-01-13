#!/usr/bin/env bash
set -e

# Seed Postgres with service SQL files by executing inside the postgres container
CONTAINER_NAME=postgres

echo "Waiting for Postgres to be ready..."
./scripts/wait_for.sh localhost:5432 60

echo "Seeding Postgres..."
for f in services/*/sql/init.sql; do
  echo "Applying $f"
  docker exec -i $CONTAINER_NAME psql -U postgres -d ecommerce -f - < $f
done

# Seed Mongo products
if [ -f ./scripts/seed_products.sh ]; then
  echo "Seeding products into MongoDB..."
  ./scripts/seed_products.sh
fi

echo "Seed completed."