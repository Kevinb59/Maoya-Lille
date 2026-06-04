/** Identifiant DOM de la section avis Google */
export const GOOGLE_REVIEWS_SECTION_ID = 'avis-google'

export type GoogleReview = {
  id: number
  author: string
  rating: number
  date: string
  text: string
}

export type GoogleReviewsSummary = {
  businessName: string
  rating: number
  totalReviews: number
  /** TODO : remplacer par l’URL Google Business réelle */
  googleUrl: string
}

/** Résumé manuel — remplacé par l’API plus tard si disponible */
export const googleSummary: GoogleReviewsSummary = {
  businessName: 'Maoya MakeUp Lille',
  rating: 4.9,
  totalReviews: 152,
  googleUrl:
    import.meta.env.VITE_GOOGLE_REVIEWS_URL ?? '#',
}

/**
 * Avis de secours (maquette + fallback si /api/google-reviews échoue).
 */
export const fallbackReviews: GoogleReview[] = [
  {
    id: 1,
    author: 'Claire D.',
    rating: 5,
    date: 'il y a 2 semaines',
    text: 'Très belle expérience, service sérieux et résultat impeccable. Je recommande sans hésiter.',
  },
  {
    id: 2,
    author: 'Marc L.',
    rating: 5,
    date: 'il y a 1 mois',
    text: 'Professionnel, réactif et à l’écoute. Le rendu final correspond parfaitement à ce que je voulais.',
  },
  {
    id: 3,
    author: 'Sophie M.',
    rating: 5,
    date: 'il y a 2 mois',
    text: 'Excellent contact, travail soigné et beaucoup de goût dans les détails. Merci encore.',
  },
  {
    id: 4,
    author: 'Julien R.',
    rating: 4,
    date: 'il y a 3 mois',
    text: 'Très satisfait du résultat. Communication claire et accompagnement sérieux du début à la fin.',
  },
  {
    id: 5,
    author: 'Amélie P.',
    rating: 5,
    date: 'il y a 4 mois',
    text: 'Une prestation de qualité avec de très bons conseils. Je referai appel à vous avec plaisir.',
  },
]
