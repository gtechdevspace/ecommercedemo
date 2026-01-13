#!/usr/bin/env bash
set -e

# Bring up stack
docker-compose -f docker-compose.dev.yml up -d --build --remove-orphans

# Wait for services
./scripts/wait_for.sh localhost:5432 120
./scripts/wait_for.sh localhost:27017 120
./scripts/wait_for.sh localhost:6379 120
./scripts/wait_for.sh localhost:4566 120
./scripts/wait_for.sh localhost:4200 120
./scripts/wait_for.sh localhost:4400 120
./scripts/wait_for.sh localhost:4500 120

# Seed
./scripts/seed_local.sh

# Run integration script and capture output
npx ts-node tests/integration/order-flow.test.ts > integration_result.txt 2>&1 || true
cat integration_result.txt

# Collect logs
docker-compose -f docker-compose.dev.yml logs > integration_logs.txt || true

# Tear down
docker-compose -f docker-compose.dev.yml down -v || true

# Exit with non-zero if test failed
if grep -q "Integration test passed" integration_result.txt; then
  echo "Integration test succeeded"
  exit 0
else
  echo "Integration test failed"
  exit 2
fi