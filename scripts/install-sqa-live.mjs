import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { resolve, join } from 'node:path'

const source = process.argv[2] && resolve(process.argv[2])
if (!source || !existsSync(join(source, 'index.html'))) throw new Error('Usage: npm run install:live -- <sqa-live-dist>')
const html = readFileSync(join(source, 'index.html'), 'utf8')
if (!html.includes('/apps/live/')) throw new Error('Run npm run build:hub in SQA Live first')
if (!existsSync(join(source, 'assets'))) throw new Error('Missing built assets')
const destination = resolve('public/apps/live')
if (source === destination || destination.startsWith(source + '/')) throw new Error('Invalid source path')
mkdirSync(resolve('public/apps'), { recursive: true })
rmSync(destination, { recursive: true, force: true })
cpSync(source, destination, { recursive: true })
console.log('Installed SQA Live preview at /apps/live/')
