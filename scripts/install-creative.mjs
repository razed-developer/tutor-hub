import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'

const sourceArg = process.argv[2]
if (!sourceArg) {
  console.error('Usage: node scripts/install-creative.mjs <path-to-creative-dist>')
  process.exit(1)
}
const source = resolve(sourceArg)
const entry = join(source, 'index.html')
if (!existsSync(entry) || !statSync(entry).isFile()) throw new Error('Creative build index.html not found')
const html = readFileSync(entry, 'utf8')
if (!html.includes('/apps/creative/')) {
  throw new Error('Creative must be built with CREATIVE_BASE_PATH=/apps/creative/ before packaging')
}
if (!existsSync(join(source, 'assets'))) throw new Error('Creative build assets/ directory not found')
const destination = resolve('public/apps/creative')
const staging = resolve('public/apps/.creative-staging')
if (source === destination || source === staging || source.startsWith(destination + '/')) {
  throw new Error('Source must be outside Tutor Hub public/apps/creative')
}
rmSync(staging, { recursive: true, force: true })
mkdirSync(dirname(staging), { recursive: true })
try {
  cpSync(source, staging, { recursive: true })
  if (!readdirSync(staging).includes('index.html')) throw new Error('Staging verification failed')
  rmSync(destination, { recursive: true, force: true })
  renameSync(staging, destination)
  console.log('Installed Creative at /apps/creative/ from ' + source)
} finally {
  rmSync(staging, { recursive: true, force: true })
}
