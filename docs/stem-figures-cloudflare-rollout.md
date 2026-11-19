# Deploying the complete STEM Figures collection

**Deployment decision:** use **seven independent Cloudflare Pages projects**, each hosted at its own origin root. Add links to all seven in Tutor Hub's Tools catalogue. This is intentionally different from the earlier proposed `/apps/stem-<name>/` nested deployment.

## Why separate origins?

Upstream apps use root-relative paths throughout components and data files. Hosting them under `/apps/stem-<name>/` requires numerous source rewrites and introduces maintenance risk on every upstream update. Root-hosted static builds preserve the original navigation paths and attribution, while Tutor Hub remains the student's central directory.

## App inventory

| Upstream workspace | Suggested Pages project | Suggested catalogue title |
| --- | --- | --- |
| `apps/math` | `tutor-stem-math` | Math Figures |
| `apps/biology` | `tutor-stem-biology` | Biology Figures |
| `apps/chemistry` | `tutor-stem-chemistry` | Chemistry Figures |
| `apps/physics` | `tutor-stem-physics` | Physics Figures |
| `apps/engineering` | `tutor-stem-engineering` | Engineering Figures |
| `apps/economics` | `tutor-stem-economics` | Economics Figures |
| `apps/stem` | `tutor-stem-directory` | STEM Figures |

Names are proposals, **not** existing or verified Cloudflare project URLs.

## Build requirements

Upstream: https://github.com/teacherdotdev/stem-figures

- Clone or fetch upstream at a recorded, pinned commit.
- Install dependencies using the repository's lockfile.
- Build each app using `@sveltejs/adapter-static` with its default root base path (no `paths.base`). Use `node scripts/build-stem-figures.mjs /path/to/stem-figures math` from the Tutor Hub repository, substituting each app name. The script expects the upstream checkout's dependencies, including the static adapter, to be installed.
- Use strict prerender error handling. A successful build with `handleHttpError: 'warn'` is **not sufficient**.
- Keep each app's build directory as that Pages project's output. Do **not** combine multiple root-hosted outputs into Tutor Hub's `public/apps`.
- Preserve teacher.dev attribution, Apache-2.0 license and notices. Verify any app-specific external resources and terms.
- Test a Pages preview before making the app's URL public or adding its catalogue card.

### Important operational detail

The upstream SvelteKit apps currently use the Vercel adapter. Do not assume `npm run build` is Cloudflare-ready without a reproducible adapter-static overlay or an integration branch. The local experiments temporarily replace `svelte.config.js` during the build and restore it afterward. For production, prefer a version-pinned build script in a controlled deployment repository or CI workflow, with restoration even on failure.

## Cloudflare setup (per app)

Create a Pages project for each output, configure the root-hosted static build, and deploy its generated files. Verify the actual assigned `*.pages.dev` address rather than guessing it. If deploying with Wrangler, authenticate with a Cloudflare account authorized for the intended projects; never commit API tokens.

For each project, verify the homepage, generator routes, deep-link refresh, favicon and example images, interactive editors, image export/download, mobile layout, and teacher.dev attribution. Run `node scripts/verify-stem-figures-build.mjs /path/to/stem-figures math` (substitute each app) as a basic artifact smoke test. This does not replace browser testing. Only then add a Tools entry via Tutor Hub's existing admin catalogue.

## Updating later

1. Review the upstream changes and security advisories.
2. Pin a new commit, run tests and strict static builds for all seven.
3. Deploy each app to a **preview** and verify routes and exports.
4. Promote successful builds; update Tutor Hub catalogue only if the URL changed.
5. Record the commit, deployment date, and test results in `docs/app-inventory.md`.

The Tutor Hub deployment itself need not change when only the independently hosted STEM Figures apps are updated.

## Status

**All seven root-hosted strict adapter-static builds passed on 2026-11-19** in the approved Sphynx workspace: math, biology, chemistry, physics, engineering, economics, and stem. The experimental build script restored each original SvelteKit config afterward. This is build verification only; browser functionality and Cloudflare preview deployments remain outstanding. **No Cloudflare projects or catalogue entries have been created by this documentation change.** Do not present proposed project names as live links.

## Routing discovery

All seven outputs include `index.html`, `200.html`, and bundled `_app` assets. Many generator URLs (for example `/coordinate-grid`) **do not have a corresponding prerendered HTML file**. They depend on SvelteKit's client-side routing and the `200.html` SPA fallback. The Cloudflare preview must verify that directly loading and refreshing these URLs serves the fallback correctly; a homepage-only check is insufficient. Some example and informational pages are prerendered to `*.html`.

Static build sizes from the pinned local upstream commit `3bb4319`: math ~31 MB, biology ~15 MB, chemistry ~24 MB, physics ~13 MB, engineering ~1.9 MB, economics ~8.7 MB, STEM landing ~208 KB. These are local artifact sizes, not Cloudflare storage or bandwidth estimates.

**Cross-site links:** The upstream sites refer to each other through their existing public domains. Until those links are intentionally reconfigured, navigating between subjects may leave the independently hosted copies. The Tutor Hub catalogue can link directly to each independent deployment; verify this behavior with students before launch.
