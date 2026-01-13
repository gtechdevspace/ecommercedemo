Prerequisites

- Node.js >= 18 (use nvm to switch/node version manager)
- Docker & docker-compose

Run locally

- `docker-compose -f docker-compose.dev.yml up -d --build`
- `./scripts/seed_local.sh`
- `cd frontend && npm install && npm run dev`

Run tests across the monorepo

- `npm run test:workspaces`  # runs `npm test` in each workspace (CI runs on Node 18)

Run integration tests locally

- `./scripts/run_integration.sh`  # brings up `docker-compose.dev.yml`, seeds DBs and runs integration script; requires Docker and Node 18