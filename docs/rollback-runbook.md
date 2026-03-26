# Rollback Runbook

## Trigger Conditions

- Error budget burn rate exceeds threshold.
- Confirmed user-facing regression in explanation quality or performance.
- Security/privacy issue requiring immediate containment.

## Backend Rollback

1. Disable inference via kill switch (`enableExplainer=false`).
2. Roll back Vercel deployment to previous known-good build.
3. Verify `/api/health` and canary `/api/explain`.
4. Keep heightened monitoring for 60 minutes.

## Extension Rollback

1. Halt rollout in Chrome Web Store.
2. Revert to prior approved extension version.
3. Announce incident update and expected mitigation timeline.

## Communication

- Incident commander posts updates every 30 minutes.
- Internal status page tracks mitigation progress and final postmortem link.
