/** Seuil swipe horizontal (px) */
export const PRESTATION_CAROUSEL_SWIPE_PX = 48

/** Ratio horizontal / vertical pour valider un swipe */
export const PRESTATION_CAROUSEL_SWIPE_RATIO = 1.25

/**
 * Décalage circulaire d'une carte par rapport à l'active (0 = centre).
 */
export function getPrestationCardOffset(
  cardIndex: number,
  step: number,
  total: number,
) {
  return (cardIndex - step + total * 8) % total
}

/**
 * Position visuelle dans l'arc (0 centre, 1 droite, prev gauche, hidden).
 */
export function getPrestationCarouselSlot(
  offset: number,
  total: number,
): '0' | '1' | 'prev' | 'hidden' {
  if (offset === 0) return '0'
  if (total === 2 && offset === 1) return '1'
  if (offset === 1) return '1'
  if (offset === total - 1 && total > 2) return 'prev'
  return 'hidden'
}
