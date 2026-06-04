/**
 * Chemins centralisés des médias statiques (dossier public/assets).
 * Convention : pages / {page} / {section} / {type} / fichier
 *
 * Sources brutes : RESSOURCES/pages/... (non versionné)
 * Fichiers servis : public/assets/pages/... (versionné pour le site)
 */

const ASSETS_ROOT = '/assets'

/** Construit un chemin public vers un asset */
export function assetPath(...segments: string[]): string {
  return `${ASSETS_ROOT}/${segments.join('/')}`
}

/** Médias de la page d'accueil */
export const homeAssets = {
  hero: {
    /** Source brute : RESSOURCES/pages/home/hero/videos/hero2.mp4 → `npm run video:pingpong` */
    /** Avant + arrière fusionnés : boucle fluide sans à-coup (servi sur le site) */
    videoPingPong: assetPath(
      'pages',
      'home',
      'hero',
      'videos',
      'hero-pingpong.mp4',
    ),
    poster: assetPath('pages', 'home', 'hero', 'images', 'hero-poster.jpg'),
    logo: assetPath('pages', 'home', 'hero', 'logos', 'logo-maoya.svg'),
    logoAlt: assetPath('pages', 'home', 'hero', 'logos', 'logo-maoya.png'),
  },
  intro: {
    image: assetPath('pages', 'home', 'intro', 'images', 'intro.webp'),
    imageVerso: assetPath('pages', 'home', 'intro', 'images', 'intro2.webp'),
  },
} as const

/** Identifiant DOM de la section hero (suivi du scroll du header) */
export const HOME_HERO_SECTION_ID = 'home-hero'
