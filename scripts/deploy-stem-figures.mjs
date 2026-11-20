#!/usr/bin/env node
/**
 * Create and deploy all seven STEM Figures apps to Cloudflare Pages.
 *
 * Prerequisites:
 * - npm ci and @sveltejs/adapter-static installed in upstream checkout.
 * - Wrangler authenticated in this environment (npx wrangler login), or
 *   CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID configured privately.
 * - Build script in this repo: scripts/build-stem-figures.mjs
 *
 * Usage: node scripts/deploy-stem-figures.mjs /path/to/stem-figures
 *        node scripts/deploy-stem-figures.mjs /path/to/stem-figures --dry-run
 *
 * WARNING: Without --dry-run, this creates Pages projects if missing and
 * uploads all seven applications to production branches.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const upstream = resolve(process.argv[2] || '.')
const dryRun = process.argv.includes('--dry-run')
const scriptDir = resolve(fileURLToPath(new URL('.', import.meta.url)))
const apps = [
  ['math', 'tutor-stem-math'],
  ['biology', 'tutor-stem-biology'],
  ['chemistry', 'tutor-stem-chemistry'],
  ['physics', 'tutor-stem-physics'],
  ['engineering', 'tutor-stem-engineering'],
  ['economics', 'tutor-stem-economics'],
  ['stem', 'tutor-stem-directory']
]
if (!existsSync(join(upstream, 'apps', 'math', 'svelte.config.js'))) {
  console.error('Expected a STEM Figures upstream checkout as the first argument')
  process.exit(2)
}
function run(cmd, args, options = {}) {
  console.log('+', cmd, ...args)
  if (dryRun) return { status: 0, stdout: '' }
  const result = spawnSync(cmd, args, { encoding: 'utf8', stdio: options.capture ? 'pipe' : 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) {
    if (options.capture) console.error(result.stderr)
    throw new Error(`Command failed (${result.status}): ${cmd} ${args.join(' ')}`)
  }
  return result
}
const wrangler = (...args) => run('npx', ['--yes', 'wrangler', ...args])
if (!dryRun) {
  // Fail before starting builds if there is no authenticated account.
  const auth = spawnSync('npx', ['--yes', 'wrangler', 'whoami'], { encoding: 'utf8' })
  const authText = (auth.stdout || '') + (auth.stderr || '')
  if (auth.status !== 0 || authText.includes('You are not authenticated')) {
    console.error('Wrangler is not authenticated in this environment. Run: npx wrangler login')
    process.exit(1)
  }
}
const results = []
for (const [app, project] of apps) {
  console.log(`\n=== ${app} → ${project} ===`)
  run('node', [join(scriptDir, 'build-stem-figures.mjs'), upstream, app])
  run('node', [join(scriptDir, 'verify-stem-figures-build.mjs'), upstream, app])
  if (dryRun) {
    wrangler('pages', 'project', 'create', project, '--production-branch', 'main')
    wrangler('pages', 'deploy', join(upstream, 'apps', app, 'build'), '--project-name', project, '--branch', 'main')
    continue
  }
  // Project existence is checked explicitly: do not mask authentication errors
  // by blindly attempting creation.
  const existing = spawnSync('npx', ['--yes', 'wrangler', 'pages', 'project', 'list', '--json'], { encoding: 'utf8' })
  if (existing.status !== 0) throw new Error('Could not list Cloudflare Pages projects: ' + (existing.stderr || 'unknown error'))
  let projects
  try { projects = JSON.parse(existing.stdout) }
  catch { throw new Error('Could not parse Wrangler project list. Check your Wrangler version and credentials.') }
  if (!Array.isArray(projects)) throw new Error('Unexpected Pages project list format')
  if (!projects.some(p => p.name === project)) {
    wrangler('pages', 'project', 'create', project, '--production-branch', 'main')
  }
  const deployment = wrangler('pages', 'deploy', join(upstream, 'apps', app, 'build'), '--project-name', project, '--branch', 'main')
  results.push({ app, project, status: deployment.status === 0 ? 'deployed' : 'failed' })
}
if (!dryRun) {
  const file = join(process.cwd(), 'stem-figures-deployments.json')
  writeFileSync(file, JSON.stringify(results, null, 2) + '\n')
  console.log('Deployment project names written to:', file)
  console.log('Verify actual URLs with Wrangler or the Cloudflare dashboard before adding catalogue links.')
} else console.log('\nDry run completed; no Cloudflare projects or deployments were changed.')
