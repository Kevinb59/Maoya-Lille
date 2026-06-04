import { useCallback, useEffect, useRef, useState } from 'react'
import {
  maoyaUniverses,
  UNIVERSE_CAROUSEL_COUNT,
} from '@/config/maoyaUniverses'
import { useIsInView } from '@/hooks/useIsInView'
import './HomeUniversCarouselSection.css'

export const HOME_UNIVERS_CAROUSEL_ID = 'univers-maoya'

const AUTOPLAY_MS = 5000
const STAGE_HEIGHT_MIN = 400
/** Marge sous la carte active (cartes latérales décalées ~52px) */
const STAGE_HEIGHT_BUFFER = 64

/** Distance minimale (px) pour valider un swipe horizontal */
const SWIPE_THRESHOLD_PX = 48

/** Le swipe horizontal doit dominer le geste vertical (évite de bloquer le scroll) */
const SWIPE_AXIS_RATIO = 1.25

/**
 * Décalage circulaire d'une carte par rapport à l'active (0 = centre).
 */
function getCardOffset(cardIndex: number, step: number) {
  return (
    (cardIndex - step + UNIVERSE_CAROUSEL_COUNT * 8) %
    UNIVERSE_CAROUSEL_COUNT
  )
}

/**
 * Carrousel en arc : les 4 cartes glissent entre les positions (transition fluide).
 */
export function HomeUniversCarouselSection() {
  const [step, setStep] = useState(0)
  const [isHoverPaused, setIsHoverPaused] = useState(false)
  const [stageHeight, setStageHeight] = useState(STAGE_HEIGHT_MIN)

  /**
   * Visibilité viewport — pause autoplay et mesures hors écran.
   */
  const { ref: visibilityRef, isInView } = useIsInView<HTMLDivElement>({
    threshold: 0.08,
  })
  const isPaused = isHoverPaused || !isInView

  const stageRef = useRef<HTMLDivElement>(null)
  const isInViewRef = useRef(isInView)
  isInViewRef.current = isInView
  const activeItemRef = useRef<HTMLElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const didSwipeRef = useRef(false)

  /**
   * Hauteur du stage selon la carte active (contenu + cartes latérales en arc).
   */
  const updateStageHeight = useCallback(() => {
    if (!isInViewRef.current) return

    const activeItem = activeItemRef.current
    if (!activeItem) {
      setStageHeight(STAGE_HEIGHT_MIN)
      return
    }

    const card = activeItem.querySelector<HTMLElement>('.home-carousel__card')
    const measured =
      card?.getBoundingClientRect().height ??
      activeItem.getBoundingClientRect().height

    setStageHeight(
      Math.max(STAGE_HEIGHT_MIN, Math.ceil(measured) + STAGE_HEIGHT_BUFFER),
    )
  }, [])

  useEffect(() => {
    if (!isInView) return
    updateStageHeight()
  }, [step, isInView, updateStageHeight])

  useEffect(() => {
    if (!isInView) return

    const activeItem = activeItemRef.current
    if (!activeItem) return

    const resizeObserver = new ResizeObserver(() => {
      updateStageHeight()
    })

    resizeObserver.observe(activeItem)
    return () => resizeObserver.disconnect()
  }, [step, isInView, updateStageHeight])

  useEffect(() => {
    if (isPaused) return

    const timer = window.setInterval(() => {
      setStep((current) => (current + 1) % UNIVERSE_CAROUSEL_COUNT)
    }, AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [isPaused])

  const goTo = (nextStep: number) => {
    setStep(
      (nextStep + UNIVERSE_CAROUSEL_COUNT * 8) % UNIVERSE_CAROUSEL_COUNT,
    )
  }

  /**
   * Swipe tactile sur le stage : gauche = suivant, droite = précédent.
   * passive: false sur touchmove pour bloquer le scroll horizontal parasite.
   */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const isHorizontalGesture = (dx: number, dy: number) =>
      Math.abs(dx) >= SWIPE_THRESHOLD_PX &&
      Math.abs(dx) > Math.abs(dy) * SWIPE_AXIS_RATIO

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return

      const touch = event.touches[0]
      touchStartRef.current = { x: touch.clientX, y: touch.clientY }
      didSwipeRef.current = false
      setIsHoverPaused(true)
    }

    const onTouchMove = (event: TouchEvent) => {
      const start = touchStartRef.current
      if (!start || event.touches.length !== 1) return

      const touch = event.touches[0]
      const dx = touch.clientX - start.x
      const dy = touch.clientY - start.y

      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * SWIPE_AXIS_RATIO) {
        event.preventDefault()
      }
    }

    const resumeAutoplay = () => {
      window.setTimeout(() => setIsHoverPaused(false), 500)
    }

    const onTouchEnd = (event: TouchEvent) => {
      const start = touchStartRef.current
      touchStartRef.current = null
      resumeAutoplay()

      if (!start) return

      const touch = event.changedTouches[0]
      const dx = touch.clientX - start.x
      const dy = touch.clientY - start.y

      if (!isHorizontalGesture(dx, dy)) return

      didSwipeRef.current = true

      if (dx < 0) {
        setStep(
          (current) => (current + 1) % UNIVERSE_CAROUSEL_COUNT,
        )
      } else {
        setStep(
          (current) =>
            (current - 1 + UNIVERSE_CAROUSEL_COUNT * 8) %
            UNIVERSE_CAROUSEL_COUNT,
        )
      }
    }

    const onTouchCancel = () => {
      touchStartRef.current = null
      resumeAutoplay()
    }

    stage.addEventListener('touchstart', onTouchStart, { passive: true })
    stage.addEventListener('touchmove', onTouchMove, { passive: false })
    stage.addEventListener('touchend', onTouchEnd, { passive: true })
    stage.addEventListener('touchcancel', onTouchCancel, { passive: true })

    return () => {
      stage.removeEventListener('touchstart', onTouchStart)
      stage.removeEventListener('touchmove', onTouchMove)
      stage.removeEventListener('touchend', onTouchEnd)
      stage.removeEventListener('touchcancel', onTouchCancel)
    }
  }, [])

  const handleCardClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (didSwipeRef.current) {
      event.preventDefault()
      didSwipeRef.current = false
    }
  }

  const activeUniverse = maoyaUniverses[step]

  return (
    <section
      id={HOME_UNIVERS_CAROUSEL_ID}
      className="home-carousel"
      aria-labelledby="home-carousel-title"
    >
      <div className="home-carousel__header">
        <h2
          id="home-carousel-title"
          className="home-carousel__title"
          style={{ color: activeUniverse.titleColor }}
        >
          L&apos;univers {activeUniverse.title}
        </h2>
        <p
          className="home-carousel__lead"
          key={activeUniverse.id}
          aria-live="polite"
        >
          {activeUniverse.tagline}
        </p>
      </div>

      <div
        ref={visibilityRef}
        className="home-carousel__wrap"
        onMouseEnter={() => setIsHoverPaused(true)}
        onMouseLeave={() => setIsHoverPaused(false)}
        onFocus={() => setIsHoverPaused(true)}
        onBlur={() => setIsHoverPaused(false)}
      >
        <div
          ref={stageRef}
          className="home-carousel__stage"
          role="list"
          aria-label="Carrousel des univers Maoya"
          style={{ height: stageHeight }}
        >
          {maoyaUniverses.map((universe, cardIndex) => {
            const offset = getCardOffset(cardIndex, step)
            const isActive = offset === 0
            const isCurrentSite = universe.id === 'makeup'

            const cardBody = (
              <>
                <div className="home-carousel__card-media">
                  <img
                    src={universe.image}
                    alt=""
                    className="home-carousel__card-image"
                    loading={isActive ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                  />
                </div>

                <div className="home-carousel__card-body">
                  <span className="home-carousel__card-label">
                    #{cardIndex + 1}
                  </span>
                  <h3
                    className="home-carousel__card-title"
                    style={{ color: universe.titleColor }}
                  >
                    {universe.title}
                  </h3>
                  <p className="home-carousel__card-host">
                    {universe.hostname}
                  </p>
                  <p className="home-carousel__card-desc">
                    {universe.description}
                  </p>
                  {!isCurrentSite && (
                    <span className="home-carousel__card-cta">
                      Visiter le site
                    </span>
                  )}
                </div>
              </>
            )

            return (
              <article
                key={universe.id}
                ref={isActive ? activeItemRef : undefined}
                className={`home-carousel__item home-carousel__item--offset-${offset}`}
                role="listitem"
                aria-hidden={!isActive}
              >
                {isCurrentSite ? (
                  <div
                    className="home-carousel__card home-carousel__card--current-site"
                    tabIndex={isActive ? 0 : -1}
                  >
                    {cardBody}
                  </div>
                ) : (
                  <a
                    href={universe.url}
                    className="home-carousel__card"
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isActive ? 0 : -1}
                    onClick={handleCardClick}
                  >
                    {cardBody}
                  </a>
                )}
              </article>
            )
          })}
        </div>

        <div className="home-carousel__controls" aria-label="Navigation du carrousel">
          <button
            type="button"
            className="home-carousel__btn"
            onClick={() => goTo(step - 1)}
            aria-label="Univers précédent"
          >
            ‹
          </button>
          <div className="home-carousel__dots" role="tablist">
            {maoyaUniverses.map((universe, index) => (
              <button
                key={universe.id}
                type="button"
                role="tab"
                className={`home-carousel__dot${step === index ? ' home-carousel__dot--active' : ''}`}
                aria-selected={step === index}
                aria-label={`Afficher ${universe.title}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className="home-carousel__btn"
            onClick={() => goTo(step + 1)}
            aria-label="Univers suivant"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
