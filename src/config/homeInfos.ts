/** Identifiant DOM — section pratique & newsletter */
export const HOME_INFOS_SECTION_ID = 'infos'

export type HomeInfosScheduleItem = {
  label: string
  detail: string
}

/**
 * Textes section Infos — horaires, déplacement, avis exceptionnel.
 */
export const homeInfosContent = {
  sectionTitle: 'Infos',
  visit: {
    title: 'Votre visite AU SALON',
    intro:
      'Pour vous renseigner, découvrir notre gamme de produits professionnels ou nous laisser prendre soin de vous.',
    schedule: [
      {
        label: 'Sur Rendez-vous',
        detail: 'du mardi au samedi de 10H à 20H',
      },
      {
        label: 'Accès libre au showroom produits',
        detail: 'le vendredi et samedi de 10H à 18H',
      },
    ] satisfies HomeInfosScheduleItem[],
  },
  homeService: 'Maoya se déplace à domicile !',
  /** Message temporaire — vider la chaîne pour masquer l’encart */
  closureNotice:
    'Ce samedi 23 mai, le salon sera exceptionnellement fermé à partir de 13h.',
  newsletter: {
    title: 'Newsletter',
    lead: 'Recevez nos actualités, offres et conseils maquillage.',
    emailLabel: 'Adresse e-mail',
    emailPlaceholder: 'votre@email.fr',
    submitLabel: "S'inscrire",
    successMessage:
      'Merci ! Votre inscription à la newsletter est bien enregistrée.',
    errorMessage: 'Veuillez saisir une adresse e-mail valide.',
  },
} as const
