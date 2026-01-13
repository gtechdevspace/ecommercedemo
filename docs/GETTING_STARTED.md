# Getting started (local dev)

Prereqs: Docker, Node 18+, npm

1. Start infra services:
   docker-compose up -d

2. Start Auth service locally:
   cd services/auth
   cp .env.example .env
   npm install
   npm run dev

3. Start User service locally:
   cd services/user
   npm install
   npm run dev

Testing:
- Ensure Mongo is listening, then run `npm test` inside each service.

Notes:
- Localstack is included for SNS/SQS emulation.
- For production, use AWS SNS/SQS, ECS Fargate, API Gateway, and AWS Secrets Manager for secrets.
