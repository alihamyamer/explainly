# Explainly

AI-powered Chrome extension that explains hovered text using a Vercel-hosted API.

## Project Structure

- `api/`: Vercel serverless endpoints and security/observability helpers.
- `extension/`: Manifest V3 extension runtime.
- `docs/`: Deployment, rollout, compliance, and operational artifacts.
- `scripts/`: Build/release helper scripts.

## Quick Start

1. Copy `.env.example` to `.env.local` and fill values.
2. Run environment checks:
   - `npm run check`
3. Build extension package:
   - `npm run build:extension`

## Deployment Model

- `main` branch deploys to staging.
- Tagged release deploys to production.
- Use phased rollout docs before each channel promotion.
