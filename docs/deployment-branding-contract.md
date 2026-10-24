# Deployment Branding and Integration Contract (v1)

Status: proposed foundation — no production behaviour changed.

## Principle

Applications (Creative, Live, Homer, Archimedes, Alexandria, Sphynx) are reusable products. A deployment chooses presentation, integrations and data boundaries. Tutor Razed and Side Quest Academy can run the same application code without forking the product.

## Configuration shape

A deployment supplies a validated configuration at build time or from a same-origin public runtime JSON endpoint. **No credentials or private keys belong in client-visible configuration.**

```json
{
  "schemaVersion": 1,
  "deploymentId": "tutor-razed",
  "applicationId": "creative",
  "basePath": "/apps/creative/",
  "brand": {
    "organizationName": "Tutor Razed",
    "productName": "Creative",
    "logoUrl": "/branding/tutor-razed/logo.svg",
    "themeId": "razed"
  },
  "features": {
    "accounts": false,
    "cloudSave": false
  },
  "integrations": {
    "identity": "none",
    "storage": "local"
  }
}
```

## Requirements

1. Every application must work without hard-coded SQA or Tutor Razed labels in its UI, links, document exports or metadata.
2. The `basePath` must control asset URLs and client-side routing. A Vite build for `/apps/creative/` must not request assets from `/assets/`.
3. Features are explicit capabilities, not security controls. Authorization must be enforced by the backend.
4. Identity, storage and real-time services use adapters; applications do not import another deployment's database implementation.
5. Deployment IDs partition user data, object storage, sessions and API authorization. Local-only prototype data must not be treated as a production student record.
6. Configuration is schema-validated with safe defaults; unknown versions fail visibly instead of silently guessing.
7. Each application's repository remains independent. Tutor Hub packages immutable, versioned build outputs; it does not become the source of application code.
8. Cloudflare Pages preview URLs are not automatically private. Protect student-facing deployments before using real student data.
9. Video/microphone permissions must be scoped for Live, not globally enabled for every game.
10. Preserve existing Tutor Hub catalogue, Cloudflare Functions and packaged games during rollout.

## First implementation sequence

- [ ] Introduce a small typed configuration loader in Creative with a checked-in Tutor Razed example.
- [ ] Replace Creative's hard-coded brand strings and configure Vite's base path.
- [ ] Build Creative and verify deep links, JS/CSS/assets, local save and exports.
- [ ] Add an automated, version-pinned package step to Tutor Hub on this feature branch.
- [ ] Test a Cloudflare preview deployment and existing game routes.
- [ ] Add Creative to the Tools catalogue only after the preview passes.
- [ ] Define an SQA configuration and storage/identity adapters separately, without migrating student data prematurely.

## Non-goals for v1

Subscriptions, tenant self-service, a theme editor, cross-deployment single sign-on, live student records and an organization administration dashboard.
