import { useEffect, useId, useRef, useState } from 'react'
import type { PrestationCard } from '@/config/homePrestations'

type HomePrestationCardProps = {
  card: PrestationCard
  /** Carte au centre du carrousel mobile — seule focusable */
  isCarouselActive?: boolean
  /** Mode carrousel : hauteur description illimitée + mesure layout */
  inCarousel?: boolean
  /** Index actif du carrousel — referme la description au changement de slide */
  carouselStep?: number
  /** Callback après ouverture / fermeture de la description (ResizeObserver) */
  onLayoutChange?: () => void
  /** Pause / reprise de l'autoplay du carrousel (description ouverte) */
  onAutoplayPause?: (paused: boolean) => void
}

/**
 * Carte prestation : image, titre, bouton pour afficher la description.
 */
export function HomePrestationCard({
  card,
  isCarouselActive = true,
  inCarousel = false,
  carouselStep,
  onLayoutChange,
  onAutoplayPause,
}: HomePrestationCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const descriptionId = useId()
  const cardRef = useRef<HTMLElement>(null)

  /**
   * Referme la description quand on change de slide dans le carrousel.
   */
  useEffect(() => {
    if (!inCarousel || carouselStep === undefined) return
    setIsOpen(false)
    onAutoplayPause?.(false)
  }, [carouselStep, inCarousel, onAutoplayPause])

  /**
   * Mesure la hauteur réelle de la carte active pour ajuster le stage du carrousel.
   */
  useEffect(() => {
    if (!inCarousel || !isCarouselActive || !onLayoutChange) return

    const element = cardRef.current
    if (!element) return

    const observer = new ResizeObserver(() => {
      onLayoutChange()
    })

    observer.observe(element)
    onLayoutChange()

    return () => observer.disconnect()
  }, [inCarousel, isCarouselActive, onLayoutChange])

  /**
   * Re-mesure après la transition d'ouverture de la description.
   */
  useEffect(() => {
    if (!onLayoutChange) return

    onLayoutChange()
    const timer = window.setTimeout(onLayoutChange, 450)

    return () => window.clearTimeout(timer)
  }, [isOpen, onLayoutChange])

  const toggleDescription = () => {
    setIsOpen((open) => {
      const next = !open
      onAutoplayPause?.(next)
      return next
    })
  }

  const handleDescriptionTransitionEnd = () => {
    onLayoutChange?.()
  }

  const media = (
    <div className="prestation-card__media">
      <img
        src={card.image}
        alt=""
        className="prestation-card__image"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  )

  return (
    <article
      ref={cardRef}
      className={`prestation-card${inCarousel ? ' prestation-card--carousel' : ''}`}
    >
      {card.href ? (
        <a
          href={card.href}
          className="prestation-card__media-link"
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isCarouselActive ? 0 : -1}
        >
          {media}
        </a>
      ) : (
        media
      )}

      <div className="prestation-card__body">
        <h3 className="prestation-card__title">
          {card.href ? (
            <a
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="prestation-card__title-link"
              tabIndex={isCarouselActive ? 0 : -1}
            >
              {card.title}
            </a>
          ) : (
            card.title
          )}
        </h3>

        <button
          type="button"
          className="prestation-card__toggle"
          aria-expanded={isOpen}
          aria-controls={descriptionId}
          tabIndex={isCarouselActive ? 0 : -1}
          onClick={toggleDescription}
        >
          {isOpen ? 'Réduire' : 'En savoir plus'}
        </button>

        <div
          id={descriptionId}
          className={`prestation-card__description${isOpen ? ' prestation-card__description--open' : ''}${inCarousel ? ' prestation-card__description--carousel' : ''}`}
          aria-hidden={!isOpen}
          onTransitionEnd={handleDescriptionTransitionEnd}
        >
          <p>{card.description}</p>
        </div>
      </div>
    </article>
  )
}
