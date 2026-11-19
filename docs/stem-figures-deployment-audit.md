# STEM Figures deployment compatibility audit (2026-11-19)

Upstream: https://github.com/teacherdotdev/stem-figures

## Confirmed from the checked-out upstream source

All seven apps exist under `apps/`: `math`, `biology`, `chemistry`, `physics`, `engineering`, `economics`, `stem`. Each currently uses `@sveltejs/adapter-vercel` in `svelte.config.js`. Therefore its current build output is **not** directly installable as a static Cloudflare Pages application.

All seven root `src/routes/+page.ts` files set `export const prerender = true`. Several apps have prerendered example routes with enumerated `entries`, plus sitemap/text endpoints. This is encouraging but **does not establish that all routes are static**. Audit remaining route files, asset URLs, domain-specific links, and any server endpoints before changing adapters.

## Deployment approach to test

1. Create a separate integration branch or reproducible build overlay. Do not modify the upstream tracking branch for deployment-specific changes.
2. Test `@sveltejs/adapter-static` with `paths.base = '/apps/stem-<name>'` and explicit prerender settings. Record build errors and unresolved routes. Prefer an adapter that emits only static assets if every required route can be prerendered.
3. Test each app's generated entrypoint, CSS/JS/assets, nested navigation, exports, and author attribution at its exact nested path.
4. If static builds fail because of required runtime endpoints, evaluate Cloudflare-compatible server builds or separately hosted applications rather than silently dropping features.
5. Package version-pinned outputs separately into `public/apps/stem-<name>/`. Do not commit a vendor source checkout into Tutor Hub.
6. Verify Cloudflare Pages preview and the existing five packaged apps, then add seven Tools catalogue entries via the admin API.
7. Retain Apache-2.0 license/notice and teacher.dev credit, record upstream commit in `docs/app-inventory.md`.

## Current status

- [x] Seven app directories confirmed
- [x] Vercel adapters confirmed
- [x] Root prerender settings confirmed
- [x] Some prerendered example routes confirmed
- [ ] Static adapter compatibility and full build
- [ ] Full route and asset audit
- [ ] All seven production bundles
- [ ] Cloudflare preview
- [ ] Student-facing catalogue entries

No live deployment has been changed.
