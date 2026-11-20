#!/usr/bin/env node
/**
 * Build one root-hosted STEM Figures app using a temporary adapter-static overlay.
 * Usage: node scripts/build-stem-figures.mjs /absolute/path/to/stem-figures math
 * Prerequisite: run npm ci in the upstream checkout and install a compatible
 * @sveltejs/adapter-static there. Do not run builds concurrently in one checkout.
 * The upstream config is restored in a finally block even when the build fails.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = resolve(process.argv[2] || '.')
const app = process.argv[3]
const names = {
  math: 'mathfigures', biology: 'biologyfigures',
  chemistry: 'chemistryfigures', physics: 'physicsfigures',
  engineering: 'engineeringfigures', economics: 'econfigures',
  stem: 'stemfigures'
}
if (!Object.hasOwn(names, app) || !existsSync(join(root, 'apps', app, 'svelte.config.js'))) {
  console.error('Usage: node scripts/build-stem-figures.mjs <upstream-root> <math|biology|chemistry|physics|engineering|economics|stem>')
  process.exit(2)
}
const config = join(root, 'apps', app, 'svelte.config.js')
const original = readFileSync(config, 'utf8')
const overlay = `import adapter from '@sveltejs/adapter-static'
export default {
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', fallback: '200.html' }),
    prerender: { entries: ['*'] },
    alias: { $shared: '../../packages/shared/src' }
  }
}
`
try {
  writeFileSync(config, overlay)
  const result = spawnSync('npm', ['run', 'build', '--workspace', names[app]], {
    cwd: root, stdio: 'inherit'
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exitCode = result.status ?? 1
  else console.log(`Built ${app} to ${join(root, 'apps', app, 'build')}`)
} finally {
  writeFileSync(config, original)
  console.log('Restored original upstream SvelteKit configuration')
}
