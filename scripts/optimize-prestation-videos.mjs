/**
 * Optimise les bandeaux vidéo prestations (chouchouter, coacher, divertir).
 * Sources : RESSOURCES/pages/home/{section}/videos/*.mp4
 * Sortie   : public/assets/pages/home/{section}/videos/*.mp4
 *
 * Réglages alignés sur hero-pingpong : H.264, CRF 23, 1920px max, sans audio.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const ffmpeg = ffmpegInstaller.path

/** Sections concernées — CRF 24 sur divertir (séquence plus dense, ~14 Mo) */
const PRESTATION_VIDEOS = [
  { section: 'chouchouter', file: 'chouchouter.mp4', crf: 23 },
  { section: 'coacher', file: 'coacher.mp4', crf: 23 },
  { section: 'divertir', file: 'divertir.mp4', crf: 24 },
]

/**
 * Encode une source vers la sortie web (qualité proche du hero, poids réduit).
 * @param {string} input — chemin source
 * @param {string} output — chemin public final
 * @param {number} crf — facteur qualité (23 = hero, 24 si séquence très détaillée)
 */
function encodeForWeb(input, output, crf = 23) {
  const tempOutput = `${output}.tmp.mp4`

  execFileSync(
    ffmpeg,
    [
      '-y',
      '-i',
      input,
      '-vf',
      "scale='min(1920,iw)':-2:flags=lanczos",
      '-an',
      '-c:v',
      'libx264',
      '-preset',
      'fast',
      '-crf',
      String(crf),
      '-movflags',
      '+faststart',
      tempOutput,
    ],
    { stdio: 'inherit' },
  )

  fs.renameSync(tempOutput, output)
}

/** Mo affichés dans la console */
function sizeMb(filePath) {
  return (fs.statSync(filePath).size / 1024 / 1024).toFixed(1)
}

for (const { section, file, crf = 23 } of PRESTATION_VIDEOS) {
  const sourceDir = path.join(
    projectRoot,
    'RESSOURCES/pages/home',
    section,
    'videos',
  )
  const publicDir = path.join(
    projectRoot,
    'public/assets/pages/home',
    section,
    'videos',
  )
  const sourcePath = path.join(sourceDir, file)
  const publicPath = path.join(publicDir, file)

  fs.mkdirSync(sourceDir, { recursive: true })
  fs.mkdirSync(publicDir, { recursive: true })

  /* Archive la version lourde depuis public si pas encore dans RESSOURCES */
  if (!fs.existsSync(sourcePath) && fs.existsSync(publicPath)) {
    console.log(`Archivage source → RESSOURCES : ${file}`)
    fs.renameSync(publicPath, sourcePath)
  }

  if (!fs.existsSync(sourcePath)) {
    console.warn(`Source introuvable, ignoré : ${sourcePath}`)
    continue
  }

  const beforeMb = sizeMb(sourcePath)
  console.log(`\nOptimisation ${file} (source ${beforeMb} Mo)…`)

  encodeForWeb(sourcePath, publicPath, crf)

  console.log(`  → public ${sizeMb(publicPath)} Mo (était ${beforeMb} Mo source)`)
}

console.log('\nTerminé.')
