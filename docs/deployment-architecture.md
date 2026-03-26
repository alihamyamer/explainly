# Deployment Architecture

## Topology

- Vercel Projects: `explainly-dev`, `explainly-staging`, `explainly-prod`.
- API routes:
  - `POST /api/explain` for inference
  - `GET /api/health` for monitoring
  - `GET /api/usage` for quota probes
- Extension:
  - Manifest V3 service worker routes requests to environment-specific API base URL.
  - Content script captures hover text and asks background worker for explanation.

## Data and Controls

- Rate limit: rolling window and daily quota in server store (replace with Redis/Postgres in production).
- Secrets: AI provider key only in Vercel environment variables.
- CORS and origin validation: allowlist based on extension IDs.
- Feature controls:
  - `enableExplainer` kill switch.
  - environment selector for alpha/beta/prod channeling.

## CI/CD Promotion

- `main` -> staging deploy.
- Semver tag -> production deploy after checklist approval.
- Extension package built from same tag and uploaded to matching Chrome Web Store channel.
