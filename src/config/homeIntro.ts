/** Identifiant DOM de la section carte cadeau (menu + ancres) */
export const HOME_GIFT_CARD_SECTION_ID = 'gift-card'

/** Contenus de la section carte cadeau (page d'accueil) */
export const homeIntroContent = {
  title: 'Offrez lui un cadeau inoubliable',
  subtitle: 'Bon cadeau en ligne en 48h',
  description:
    'Choisissez parmi toutes nos prestations proposées, pour 1 à 10 personnes suivant les prestations, ou directement un bon d\'achat de 10 à 500 €.',
  ctaLabel: 'Cliquez ici',
  ctaHref:
    import.meta.env.VITE_GIFT_CARD_URL ??
    'https://maoyalille.fr/offrir-une-carte-cadeau/',
} as const
