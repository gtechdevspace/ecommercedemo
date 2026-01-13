# Service Template

Copy this folder to create a new service.

Requirements in each service:
- Express server with MVC structure
- AJV for request validation
- RBAC middleware
- JWT auth middleware
- Rate limiting
- Helmet + CORS
- Input sanitization
- Central error handler
- Winston logger
- Health check endpoint
- Dockerfile
- Unit & integration tests (Jest + Supertest)

Use this template to scaffold `services/<service-name>` and update its DB and messaging configs accordingly.
