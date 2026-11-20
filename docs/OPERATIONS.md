# Tutor Hub operations: adding and updating applications

This guide reflects the current React/Vite hub and its Cloudflare Pages deployment. It does not assume that the old worksheet features described in the original README are still present.

## Architecture

- `src/App.tsx`: public Games/Tools catalogue and `/admin` editor.
- `functions/api/items.ts`: public catalogue data, read from Cloudflare D1.
- `functions/admin/api/items.ts`: catalogue create/edit/delete, backed by D1.
- `functions/admin/api/images.ts`: card image upload.
- `schema.sql`: D1 catalogue schema.
- `public/apps/<slug>/`: **built** standalone web applications, not their source repositories.
- `scripts/install-sphynx-package.mjs`: install a built Sphynx package.
- `scripts/install-creative.mjs`: install Creative's built output.
- `public/apps/README.md`: packaging and URL conventions.
- `docs/deployment-branding-contract.md`: intended deployment separation; some features are proposals, not shipped functionality.

## Adding an existing external website (fastest)

1. Open the deployed hub's `/admin` page with your authorized admin access.
2. Choose a name, destination HTTPS URL, image, and display order.
3. Select **Tools**, **Games**, or both, and enable the entry.
4. Save; verify it appears on the public hub and opens correctly.

This creates a **link** to another host. It does not copy or host that app. Check permissions and attribution before linking. Do not assume `/admin` is protected just because its path is named admin: confirm Cloudflare Access or equivalent authentication protects both the page and write endpoints before public use.

## Packaging an app into Tutor Hub (self-hosted on Pages)

1. Keep the app's editable source in its own Git repository.
2. Pin and record the source commit or release version.
3. Build for its final base URL `/apps/<slug>/`. Verify scripts, CSS, images, and client-side navigation resolve under that prefix.
4. Install only the resulting deployable files into `public/apps/<slug>/`. For supported packages, use `npm run install:sphynx -- <metadata.json> [build-directory]` or `npm run install:creative -- <dist-directory>`.
5. Run `npm install` and `npm run build` in Tutor Hub. Inspect changes; check that other apps and Cloudflare Functions remain intact.
6. Publish a **Cloudflare Pages preview deployment** first. Verify direct app URL, refresh/deep links, images/assets, export/download functionality, mobile layout, and the existing hub.
7. Merge/deploy only after checks pass. Add the catalogue entry in `/admin` pointing to `/apps/<slug>/`.

Cloudflare Pages repository build settings documented in the original README: Vite, `npm run build`, output `dist`, root `/`. Verify that Pages Functions, D1 bindings, image storage, and access controls are configured in the Cloudflare project; GitHub alone cannot confirm those settings.

## Keeping applications current

**Do not automatically merge upstream changes or overwrite production builds.**

For each bundled application, maintain a record of its upstream repository, pinned commit/tag, build command, base path, licensing/attribution requirements, install destination, and last verified deployment. Suggested inventory: `docs/app-inventory.md`.

For an update:
1. Fetch the app's upstream repository and review its changelog and changed files.
2. Compare the currently pinned commit with the candidate commit; look for breaking changes, security fixes, dependency changes, and new asset paths.
3. Build/test the app independently. Check upstream test failures before treating them as regressions.
4. Repackage into its existing `public/apps/<slug>/` location, without modifying other app directories.
5. Build Tutor Hub, test a Cloudflare preview, and confirm original author notices/links remain.
6. Record the new pinned commit and deployment date in the inventory. Then publish.

For updates to Tutor Hub itself, review changes to `src/`, `functions/`, `schema.sql`, `scripts/`, and `public/apps/`. D1 schema migrations and Cloudflare settings may require steps outside a Git commit. Avoid treating the README as a source of truth when it disagrees with the code.

## STEM Figures (teacher.dev) rollout

Upstream: https://github.com/teacherdotdev/stem-figures (Apache-2.0; verify bundled notices). Seven apps: math, biology, chemistry, physics, engineering, economics, and the additional app identified in the current upstream workspace. **Confirm the exact app list and build compatibility from upstream before publishing**; do not assume each SvelteKit app is already a static build.

Preferred destination pattern: `/apps/stem-math/`, `/apps/stem-biology/`, etc. Preserve the upstream teacher.dev attribution, original license, and notices. Build each app independently using its actual SvelteKit adapter and route requirements. Some routes may require a server or Pages Functions rather than static assets; audit first.

**Launch alternative:** add external links to the existing teacher.dev-hosted apps via `/admin` while we validate local builds. This makes the collection discoverable without claiming that it is self-hosted.

## Security and student access

- A public Pages site does not expose your home network.
- Do not publish secrets in Vite client variables, runtime JSON, or static assets.
- Confirm authentication for `/admin` **and** `/admin/api/*`; the repository's catalogue write handler itself does not check a login.
- Test D1/R2 bindings and Cloudflare access policies before changing production.
- Avoid collecting student information until privacy, retention, and authorization controls are established.

## Maintenance checklist

- [ ] GitHub main and Cloudflare production deployment correspond to the intended commit.
- [ ] Build succeeds and no unexpected generated files changed.
- [ ] Existing Games/Tools cards still open.
- [ ] All bundled apps load from their own base paths.
- [ ] Admin endpoints remain protected.
- [ ] Third-party attribution and license notices are retained.
- [ ] App inventory and update notes match what is deployed.
