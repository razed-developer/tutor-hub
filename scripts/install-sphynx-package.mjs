import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

const [metadataArg, buildArg] = process.argv.slice(2)
if (!metadataArg) {
  console.error('Usage: pnpm install:sphynx <metadata.json> [built-game-directory]')
  process.exit(1)
}

const metadataPath = resolve(metadataArg)
const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'))
const required = ['schemaVersion', 'id', 'name', 'version', 'type', 'entrypoint']
for (const field of required) {
  if (metadata[field] === undefined || metadata[field] === '') throw new Error(`Metadata is missing required field: ${field}`)
}
if (!['game', 'tool'].includes(metadata.type)) throw new Error('Metadata type must be game or tool')
if (!/^[a-z0-9][a-z0-9-]*$/.test(metadata.id)) throw new Error('Metadata id must use lowercase letters, numbers, and hyphens')

const inferredBuild = join(dirname(metadataPath), '..', 'build', 'web')
const sourceDir = resolve(buildArg ?? inferredBuild)
const entrypoint = join(sourceDir, metadata.entrypoint)
if (!existsSync(entrypoint)) throw new Error(`Package entrypoint not found: ${entrypoint}`)

const targetDir = join(process.cwd(), 'public', 'apps', metadata.id)
rmSync(targetDir, { recursive: true, force: true })
mkdirSync(targetDir, { recursive: true })
cpSync(sourceDir, targetDir, { recursive: true })
console.log(`Installed ${metadata.name} ${metadata.version} at /apps/${metadata.id}/ from ${basename(sourceDir)}`)
