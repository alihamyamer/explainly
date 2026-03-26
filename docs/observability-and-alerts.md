# Observability and Alerts

## Events and Logs

- Every API request emits:
  - `requestId`
  - `path`
  - `method`
  - `statusCode`
  - `durationMs`
- Errors emit stack and request metadata in structured JSON logs.

## Dashboards

- API reliability:
  - Request volume
  - Error rate (% 5xx and % 4xx)
  - p50/p95/p99 latency
- AI cost:
  - Token estimate per request
  - Daily spend by environment
  - Top consumers by extension ID
- User quality:
  - Explain success ratio
  - Client-side failures from extension telemetry

## Alert Thresholds

- Critical:
  - 5xx error rate > 2% for 5 minutes
  - p95 latency > 2500ms for 10 minutes
- High:
  - Token spend > 130% of daily forecast
  - Rate limit blocks increase > 3x baseline
- Informational:
  - New deployment
  - Kill switch toggle
