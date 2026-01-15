# Security Notes

This project includes several security measures and recommendations to help make the system production-ready.

Highlights implemented:

- JWT access tokens (short-lived) and refresh tokens (rotating with JTI + revocation)
- RBAC middleware (`permit(...)`) to restrict endpoints by role
- Helmet for secure HTTP headers
- CORS origin configuration via `CORS_ORIGIN` env var (default `*`, override in prod)
- Rate limiting (global + stricter login limiter) to mitigate brute-force attacks
- Input sanitization for Mongo-based services (`express-mongo-sanitize`)
- Parameterized SQL queries for Postgres services to prevent SQL injection
- Audit middleware to log state-changing actions with user ID and role
- Centralized error handlers that return generic messages to clients

Recommendations for production:

- Store secrets (JWT_SECRET, REFRESH_SECRET, STRIPE_SECRET, DB creds, AWS credentials) in a secrets manager (AWS Secrets Manager, Parameter Store, or similar).
- Use HTTPS, set secure cookie flags, and avoid storing tokens in localStorage if possible.
- Enable strict CORS (set `CORS_ORIGIN` to your frontend origin).
- Use CSP and further Helmet tuning for stricter headers as needed.
- Rotate keys and revoke compromised refresh tokens.
- Run security scans and audits in CI (Snyk, Dependabot, etc.).

If you want, I can add a small Terraform/AWS Secret Manager example and CI checks to ensure secrets are set in non-dev environments.