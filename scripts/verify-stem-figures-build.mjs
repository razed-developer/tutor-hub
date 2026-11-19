#!/usr/bin/env node
/**
 * Verify a root-hosted static STEM Figures build before uploading to Pages.
 * Usage: node scripts/verify-stem-figures-build.mjs /path/to/stem-figures math
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(process.argv[2] || '.')
const app = process.argv[3]
const valid = new Set(['math','biology','chemistry','physics','engineering','economics','stem'])
if (!valid.has(app)) {
  console.error('Usage: node scripts/verify-stem-figures-build.mjs <upstream-root> <app>')
  process.exit(2)
}
const dir = join(root, 'apps', app, 'build')
const required = ['index.html', '200.html', '_app', 'favicon.svg']
let failed = false
for (const file of required) {
  if (!existsSync(join(dir, file))) { console.error('MISSING:', file); failed = true }
}
if (failed) process.exit(1)
const html = readFileSync(join(dir, 'index.html'), 'utf8')
const fallback = readFileSync(join(dir, '200.html'), 'utf8')
if (!html.includes('/favicon.svg')) { console.error('Unexpected favicon reference'); failed = true }
if (!html.includes('_app/immutable/')) { console.error('Missing bundled application entry'); failed = true }
if (!fallback.includes('_app/immutable/')) { console.error('SPA fallback lacks application entry'); failed = true }
const files = readdirSync(dir, { withFileTypes: true })
const htmlFiles = files.filter(f => f.isFile() && f.name.endsWith('.html'))
const bytes = files.reduce((sum, f) => sum + (f.isFile() ? statSync(join(dir, f.name)).size : 0), 0)
console.log(`${app}: root HTML files=${htmlFiles.length}, top-level bytes=${bytes}, SPA fallback present`)
console.log('Reminder: most generator paths are client-side routes served through 200.html; verify deep-link refresh on Cloudflare Pages.')
if (failed) process.exitCode = 1
