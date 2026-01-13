# Ecommerce Microservices Architecture

This repository is a monorepo containing microservices and frontend for an Ecommerce platform.

Folders:
- `services/` - individual microservices (auth, user, product, cart, order, inventory, payment, notification)
- `frontend/` - React + TypeScript app
- `infra/` - infra as code samples (Terraform / CloudFormation)
- `docs/` - architecture and runbooks

Local dev
- `docker-compose up` will launch MongoDB, Postgres, Redis, and LocalStack for SNS/SQS emulation.
- Each service has a `Dockerfile` and `package.json` with `dev` and `start` scripts.

Messaging
- SNS Topics and SQS subscriptions are used for decoupled, event-driven flows (order → payment/inventory/notification)

Security
- Secrets: use AWS Secrets Manager in production. `.env` / `.env.example` used for local dev.

Next steps
- Implement service-specific DB schemas, SNS/SQS wiring, Stripe integration, API Gateway routing, and CI/CD pipelines.
