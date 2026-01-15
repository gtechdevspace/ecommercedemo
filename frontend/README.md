# Frontend (React + TypeScript)

Features:
- Vite + React + TypeScript
- Bootstrap styling
- Stripe placeholder checkout
- `Pages`: Home, Checkout
- Dockerfile for containerized preview

Run locally:
- cd frontend
- npm install
- npm run dev

Notes:
- The checkout page sends a POST to `/api/payment/charge` — when running locally with `docker-compose.dev.yml`, you can add a proxy or call the service directly via its host/port.
- Redux Toolkit implemented (in `src/store`), protected routes via `ProtectedRoute` component, and auth flows implemented including login, refresh rotation, and logout (frontend calls `/api/auth/logout` to revoke refresh token).
