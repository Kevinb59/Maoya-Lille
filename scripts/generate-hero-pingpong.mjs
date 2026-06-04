/**
 * Génère hero-pingpong.mp4 : lecture avant + arrière dans un seul fichier.
 * Boucle native (loop) sans à-coup entre fin et début.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

/* Source brute locale — non servie par le site (voir RESSOURCES/) */
const input = path.join(
  projectRoot,
  'RESSOURCES/pages/home/hero/videos/hero2.mp4',
)
const output = path.join(
  projectRoot,
  'public/assets/pages/home/hero/videos/hero-pingpong.mp4',
)

if (!fs.existsSync(input)) {
  console.error('Fichier introuvable :', input)
  process.exit(1)
}

console.log('Génération de hero-pingpong.mp4 (avant + arrière)…')

execFileSync(
  ffmpegInstaller.path,
  [
    '-y',
    '-i',
    input,
    '-filter_complex',
    '[0:v]split[fw][tmp];[tmp]reverse[rev];[fw][rev]concat=n=2:v=1:a=0[v]',
    '-map',
    '[v]',
    '-an',
    '-c:v',
    'libx264',
    '-preset',
    'fast',
    '-crf',
    '23',
    '-movflags',
    '+faststart',
    output,
  ],
  { stdio: 'inherit' },
)

const sizeMb = (fs.statSync(output).size / 1024 / 1024).toFixed(1)
console.log(`Terminé : ${output} (${sizeMb} Mo)`)
