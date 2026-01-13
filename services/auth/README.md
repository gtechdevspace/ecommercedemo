# Auth Service

Features:
- JWT access + refresh tokens
- RBAC middleware (`permit(...)`)
- AJV validation for input
- MongoDB persistence (users)
- Rate limiting, Helmet, CORS, input sanitization
- Winston logging
- Unit & integration tests (Jest + Supertest)

Run locally
- Ensure Mongo is running (see root `docker-compose.yml`)
- Copy `.env.example` to `.env` and set secrets
- npm install && npm run dev

API
- POST /api/auth/signup { email, password, role }
- POST /api/auth/login { email, password }
- POST /api/auth/refresh { token }

Notes
- Refresh token persistence and rotation will be added next (refresh token store, revocation, idempotency)
- Use `services/_template/README.md` when creating new services
