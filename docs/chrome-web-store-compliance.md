# Chrome Web Store Compliance Checklist

## Listing Metadata

- Extension name, summary, and detailed description.
- Support URL and contact email.
- Privacy policy URL and terms URL.

## Permissions Review

- Keep `permissions` minimal: only `activeTab`, `storage`.
- Keep host permissions broad only if necessary; reduce scope if product permits.
- Document why each permission is needed.

## Privacy Requirements

- Describe data collected and sent to backend.
- Explain third-party AI processing and retention defaults.
- Provide user controls and account deletion/data removal path.

## Security Controls

- No hardcoded API secrets in extension package.
- HTTPS-only endpoints.
- Request validation and abuse controls enabled server-side.
