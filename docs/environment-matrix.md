# Environment and Secrets Matrix

| Environment | Vercel Project | API Base URL | AI Key | Allowed Extension IDs | Quota Profile |
| --- | --- | --- | --- | --- | --- |
| dev | `explainly-dev` | `https://explainly-dev.vercel.app` | `AI_API_KEY_DEV` | Dev extension ID only | Relaxed |
| staging | `explainly-staging` | `https://explainly-staging.vercel.app` | `AI_API_KEY_STAGING` | Staging extension ID only | Moderate |
| prod | `explainly-prod` | `https://explainly.vercel.app` | `AI_API_KEY_PROD` | Production extension ID only | Strict |

## Required Variables

- `ENV`
- `AI_API_KEY`
- `AI_MODEL`
- `ALLOWED_EXTENSION_IDS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `USAGE_DAILY_LIMIT`
- `LOG_LEVEL`
- `SENTRY_DSN` (optional but recommended)

## Promotion Policy

- `main` deploys to staging.
- Release tags (`v*`) deploy to production after release checks.
- Extension build uses matching environment endpoint and extension ID.
