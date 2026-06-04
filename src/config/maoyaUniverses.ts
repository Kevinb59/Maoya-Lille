import { assetPath } from '@/lib/assets'

/**
 * Cartes des univers Maoya — carrousel page d'accueil.
 */
export type MaoyaUniverse = {
  id: string
  title: string
  /** Couleur du titre sur la carte carrousel */
  titleColor: string
  url: string
  hostname: string
  description: string
  /** Phrase courte sous le titre de section (carrousel) */
  tagline: string
  image: string
}

export const maoyaUniverses: MaoyaUniverse[] = [
  {
    id: 'makeup',
    title: 'Maoya MakeUp',
    titleColor: '#8b4a6b',
    url: 'https://maoyamakeup.fr',
    hostname: 'maoyamakeup.fr',
    description:
      'Site pour les clientes particulières du salon.',
    tagline: 'Vous êtes sur le site du salon — bienvenue à Lille.',
    image: assetPath('pages', 'home', 'univers', 'images', 'makeup.webp'),
  },
  {
    id: 'shop',
    title: 'Maoya Shop',
    titleColor: '#c45c7a',
    url: 'https://shop.maoyamakeup.fr',
    hostname: 'shop.maoyamakeup.fr',
    description: 'Boutique en ligne pour les particuliers.',
    tagline: 'Commandez vos produits maquillage en ligne.',
    image: assetPath('pages', 'home', 'univers', 'images', 'shop.webp'),
  },
  {
    id: 'event',
    title: 'Maoya Event',
    titleColor: '#5a6b9e',
    url: 'https://event.maoyamakeup.fr',
    hostname: 'event.maoyamakeup.fr',
    description: 'Prestations et événements pour les entreprises.',
    tagline: 'Maquillage et prestations pour vos événements pro.',
    image: assetPath('pages', 'home', 'univers', 'images', 'event.webp'),
  },
  {
    id: 'formation',
    title: 'Maoya Formation',
    titleColor: '#7a5c8b',
    url: 'https://formation.maoyamakeup.fr',
    hostname: 'formation.maoyamakeup.fr',
    description:
      'Formations pour les futurs professionnels et créateurs d’entreprise.',
    tagline: 'Se former ou lancer son activité dans la beauté.',
    image: assetPath('pages', 'home', 'univers', 'images', 'formation.webp'),
  },
]

export const UNIVERSE_CAROUSEL_COUNT = maoyaUniverses.length
