# Order → Payment → Inventory Flow

1. Client places order (POST /api/orders) to Order Service.
2. Order Service stores order in Postgres within a transaction and publishes `ORDER_CREATED` event to an SNS `order-topic`.
3. Downstream services subscribe to SNS via SQS queues:
   - Inventory Queue → Inventory Service consumes messages and attempts to reserve/decrement stock (ACID updates in Postgres).
   - Payment Queue → Payment Service processes payment (Stripe) and publishes payment success/failure events.
   - Notification Queue → Notification Service sends emails/SMS asynchronously.
4. Events are idempotent and consumers use DB transactions and idempotency guards.

Local dev notes:
- Localstack is configured in `docker-compose.yml` to emulate SNS/SQS.
- Use `AWS_ENDPOINT=http://localstack:4566` in service env for local SDK clients.

Next steps:
- Implement Inventory reservation SQL & compensation on failure.
- Add Payment idempotency and retry logic (exponential backoff).
- Add integration tests covering the full flow with localstack and Postgres.
