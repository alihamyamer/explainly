# Phased Rollout Playbook

## Alpha (Internal)

- Channel: unpacked/sideloaded extension for internal users.
- API target: `staging`.
- Mandatory checks:
  - Security baseline complete.
  - No P0 issues for 7 days.
  - p95 latency under target during office-hour traffic.

## Beta (Public Limited)

- Channel: Chrome Web Store beta listing (limited audience).
- API target: `prod` with conservative quotas.
- Mandatory checks:
  - Incident response runbook tested.
  - Privacy disclosures published.
  - Cost alerting active and validated.

## Production

- Channel: Chrome Web Store public listing.
- API target: `prod`.
- Mandatory checks:
  - Beta SLOs held for 14 consecutive days.
  - Rollback rehearsal complete in last 30 days.
  - Go/No-Go review signed off by engineering and product.
