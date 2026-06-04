/**
 * Liens du menu principal — ancres pour la page d'accueil (évolutif).
 */
export type NavItem = {
  label: string
  href: string
  /** Id DOM de la section (sans #) — scroll spy */
  sectionId: string
  /** Couleur du trait actif sous le lien */
  accentColor: string
}

export const mainNavItems: NavItem[] = [
  {
    label: 'Accueil',
    href: '#home-hero',
    sectionId: 'home-hero',
    accentColor: '#f4c4dc',
  },
  {
    label: 'Gift Card',
    href: '#gift-card',
    sectionId: 'gift-card',
    accentColor: '#e8b84a',
  },
  {
    label: 'Chouchouter',
    href: '#se-chouchouter',
    sectionId: 'se-chouchouter',
    accentColor: '#f28cb8',
  },
  {
    label: 'Coacher',
    href: '#se-coacher',
    sectionId: 'se-coacher',
    accentColor: '#7eb8e8',
  },
  {
    label: 'Divertir',
    href: '#se-divertir',
    sectionId: 'se-divertir',
    accentColor: '#ffb347',
  },
  {
    label: 'Avis',
    href: '#avis-google',
    sectionId: 'avis-google',
    accentColor: '#7dcea0',
  },
  {
    label: 'Références',
    href: '#ils-nous-ont-fait-confiance',
    sectionId: 'ils-nous-ont-fait-confiance',
    accentColor: '#b39ddb',
  },
  {
    label: 'Univers Maoya',
    href: '#univers-maoya',
    sectionId: 'univers-maoya',
    accentColor: '#c77da8',
  },
  {
    label: 'Infos',
    href: '#infos',
    sectionId: 'infos',
    accentColor: '#5dade2',
  },
]

/** Ids des sections suivies par le menu (ordre de la page) */
export const mainNavSectionIds = mainNavItems.map((item) => item.sectionId)
