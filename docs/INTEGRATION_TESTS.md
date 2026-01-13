# Integration Tests

This project contains integration test scaffolds that exercise the event-driven flow using LocalStack and Docker Compose. Run via the root of the repo.

Quick run (local dev):
1. Start infra: docker-compose up -d
2. Seed Postgres/DB schemas: run `scripts/seed_local.sh` (creates DBs and tables from `services/*/sql/init.sql`)
3. Start services in background or run selected tests which will bring up required services

Example scenarios:
- Order placed: POST /api/orders -> verify
  - Order saved in Postgres
  - SNS `order-topic` receives ORDER_CREATED
  - Inventory service (SQS) reserves stock and publishes INVENTORY_RESERVED / INVENTORY_FAILED
  - Payment service processes payment or waits for Stripe webhook
  - Notification service sends email on PAYMENT_* events

Notes:
- Tests use LocalStack for SNS/SQS and use the AWS SDK with `AWS_ENDPOINT=http://localstack:4566`.
- Some tests mock external Stripe API calls; follow the test files in each service for examples.
