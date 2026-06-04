/**
 * Lit les logos dans public/assets/pages/home/trusted-partners/logos/
 * et affiche les entrées triées par mtime (pour mettre à jour trustedPartners.ts).
 *
 * Usage : npm run sync:trusted-partners
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logosDir = path.join(
  __dirname,
  '../public/assets/pages/home/trusted-partners/logos',
)

const existing = fs.existsSync(logosDir)
  ? fs
      .readdirSync(logosDir)
      .filter((f) => /\.(webp|png|svg|jpe?g)$/i.test(f))
      .map((file) => {
        const stat = fs.statSync(path.join(logosDir, file))
        const id = file.replace(/\.[^.]+$/, '').replace(/-v\d+$/, '')
        return { file, id, mtimeMs: stat.mtimeMs }
      })
      .sort((a, b) => a.mtimeMs - b.mtimeMs)
  : []

console.log('Fichiers triés par date de modification :\n')
for (const { file, mtimeMs } of existing) {
  console.log(`  ${new Date(mtimeMs).toISOString()}  ${file}`)
}
console.log(`\nTotal : ${existing.length} logo(s)`)
console.log(
  '\nMettez à jour src/config/trustedPartners.ts (mtimeMs + noms + sites).',
)
