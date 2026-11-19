# Tutor Hub

Tutor Hub is a React + Vite + TypeScript **Games and Tools portal** deployed on Cloudflare Pages. It displays a configurable catalogue of educational games and tools, including independently built applications packaged under `public/apps/`.

**Live site:** https://tutor-razed-hub.pages.dev/

## What is implemented

- Public Games and Tools catalogue with image cards, display order, and enable/disable flags
- `/admin` catalogue editor for adding, editing, deleting, and uploading card images
- Cloudflare Pages Functions for catalogue and image APIs
- Cloudflare D1-backed catalogue schema (`schema.sql`)
- Standalone packaged applications in `public/apps/`

**Important:** The original README described a worksheet studio with printable math worksheets and pen annotations. That description is outdated relative to the current source code. Do not assume those worksheet features are available in this version.

## Start here

- **[Operations guide](docs/OPERATIONS.md):** architecture, adding links and packaged apps, updating them, Cloudflare deployment, testing, and security
- **[Application inventory](docs/app-inventory.md):** existing bundled apps and upstream-version tracking
- **[Packaged app rules](public/apps/README.md):** app directory structure and base-path requirements
- **[Deployment/branding contract](docs/deployment-branding-contract.md):** proposed cross-deployment architecture; not all described features are implemented

## Local development

```bash
npm install
npm run dev
npm run build
```

The current package also provides `npm run install:sphynx -- <metadata.json> [build-directory]` and `npm run install:creative -- <dist-directory>`. See the operations guide before replacing deployed assets.

## Cloudflare Pages

Repository build settings previously documented for this project:

| Setting | Value |
| --- | --- |
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Root directory | `/` |

The live deployment additionally relies on Cloudflare Pages Functions and configured bindings such as D1 and image storage. Confirm their settings in Cloudflare before publishing. Changes merged to the connected production branch may trigger an automatic deployment.

**Security:** The repository's admin catalogue handler does not independently verify authentication. Ensure Cloudflare Access or an equivalent policy protects the admin page and **all** admin API endpoints before exposing them publicly.

## Adding and updating tools

External websites can be linked from the `/admin` catalogue. For independently hosted applications, build them for `/apps/<slug>/`, package only their compiled output under `public/apps/<slug>/`, test a Pages preview, and then add the catalogue card. Keep source projects and their attribution independent.

See [the full procedure](docs/OPERATIONS.md).

## Planned: teacher.dev STEM Figures

The goal is to make the complete [STEM Figures](https://github.com/teacherdotdev/stem-figures) collection discoverable from the Tools catalogue and, after compatibility checks, host its seven upstream apps independently. Preserve teacher.dev credit and license notices. Track upstream commits rather than silently updating deployed copies.

No STEM Figures apps are deployed by this documentation-only change.
