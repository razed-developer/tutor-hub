#!/usr/bin/env node
/**
 * Read-only audit for a checked-out STEM Figures upstream repository.
 * Usage: node scripts/audit-stem-figures.mjs /path/to/stem-figures
 * Does not build, modify, deploy, or contact any external service.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(process.argv[2] ?? '')
if (!process.argv[2] || !existsSync(join(root, 'apps'))) {
  console.error('Usage: node scripts/audit-stem-figures.mjs <stem-figures-repo>')
  process.exit(2)
}
const apps = ['math', 'biology', 'chemistry', 'physics', 'engineering', 'economics', 'stem']
function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap(item => {
    const path = join(dir, item.name)
    return item.isDirectory() ? walk(path) : [path]
  })
}
let blockers = 0
for (const app of apps) {
  const base = join(root, 'apps', app)
  const config = join(base, 'svelte.config.js')
  if (!existsSync(config)) { console.log(app + ': MISSING'); blockers++; continue }
  const text = readFileSync(config, 'utf8')
  const files = walk(join(base, 'src')).filter(f => /\.(svelte|ts|js)$/.test(f))
  const rootRelative = files.filter(f => /(?:href|src)=["']\//.test(readFileSync(f, 'utf8')))
  const serverRoutes = files.filter(f => /\/routes\/.*\+(?:page\.server|layout\.server|server)\.(?:ts|js)$/.test(f))
  const prerenderedHome = existsSync(join(base, 'src/routes/+page.ts')) && /prerender\s*=\s*true/.test(readFileSync(join(base, 'src/routes/+page.ts'), 'utf8'))
  const adapter = /adapter-static/.test(text) ? 'static' : /adapter-vercel/.test(text) ? 'vercel' : 'other'
  console.log('\n' + app + ': adapter=' + adapter + ', root prerender=' + prerenderedHome + ', server routes=' + serverRoutes.length + ', root-relative component files=' + rootRelative.length)
  for (const f of rootRelative) console.log('  root path: ' + relative(base, f))
  for (const f of serverRoutes) console.log('  server route: ' + relative(base, f))
  if (adapter !== 'static' || rootRelative.length) blockers++
}
console.log('\nApps requiring deployment review: ' + blockers + '/' + apps.length)
if (blockers) process.exitCode = 1
