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

## Experimental static build results (2026-11-19)

A temporary local test harness substitutes `@sveltejs/adapter-static` with `/apps/stem-<name>` as the base path, then restores each upstream configuration. The experiment sets `handleHttpError: 'warn'` to diagnose bad paths. This setting must **not** be used in production.

- STEM landing: static build succeeded, but its absolute favicon URL is incompatible with nested hosting.
- Math: static build succeeded, with 378 base-path warnings.
- Biology: static build succeeded, with 125 base-path warnings.
- Chemistry: static build succeeded, with 291 base-path warnings.
- Physics: static build succeeded, with 165 base-path warnings.
- Engineering: static build succeeded, with 7 base-path warnings.
- Economics: static build succeeded, with 86 base-path warnings.
- All seven experimental static builds have now succeeded, but none is production-ready until absolute URLs are fixed.
- The original Vercel adapter build fails under local Node 26 because its default runtime support is Node 20, 22, or 24.

A successful experimental build is **not** proof of working navigation. Fix absolute URLs and rerun with strict prerender errors before packaging or deploying.
