import { useCallback, useEffect, useRef, useState } from 'react'
import type { PrestationCard } from '@/config/homePrestations'
import { useIsInView } from '@/hooks/useIsInView'
import { HomePrestationCard } from './HomePrestationCard'
import {
  getPrestationCardOffset,
  getPrestationCarouselSlot,
  PRESTATION_CAROUSEL_SWIPE_PX,
  PRESTATION_CAROUSEL_SWIPE_RATIO,
} from './homePrestationCarouselUtils'
import './HomePrestationMobileCarousel.css'

const AUTOPLAY_MS = 5000
const STAGE_HEIGHT_MIN = 400
const STAGE_HEIGHT_BUFFER = 28

type HomePrestationMobileCarouselProps = {
  cards: PrestationCard[]
  sectionLabel: string
}

/**
 * Carrousel mobile (≤640px) — arc 3 cartes visibles, comme « L'univers Maoya ».
 */
export function HomePrestationMobileCarousel({
  cards,
  sectionLabel,
}: HomePrestationMobileCarouselProps) {
  const total = cards.length
  const [step, setStep] = useState(0)
  const [isHoverPaused, setIsHoverPaused] = useState(false)
  const [isDescriptionPaused, setIsDescriptionPaused] = useState(false)
  /**
   * Visibilité viewport — pause autoplay et mesures de hauteur hors écran
   * (évite les reflows sur le reste de la page).
   */
  const { ref: visibilityRef, isInView } = useIsInView<HTMLDivElement>({
    threshold: 0.08,
  })
  const isPaused = isHoverPaused || isDescriptionPaused || !isInView

  const stageRef = useRef<HTMLDivElement>(null)
  const isInViewRef = useRef(isInView)
  isInViewRef.current = isInView
  const activeItemRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const [stageHeight, setStageHeight] = useState(STAGE_HEIGHT_MIN)

  /**
   * Ajuste la hauteur du stage selon la carte active (description ouverte incluse).
   */
  const updateStageHeight = useCallback(() => {
    if (!isInViewRef.current) return

    const activeItem = activeItemRef.current
    if (!activeItem) {
      setStageHeight(STAGE_HEIGHT_MIN)
      return
    }

    const card = activeItem.querySelector<HTMLElement>('.prestation-card')
    const measured = card?.getBoundingClientRect().height ?? activeItem.getBoundingClientRect().height

    setStageHeight(
      Math.max(STAGE_HEIGHT_MIN, Math.ceil(measured) + STAGE_HEIGHT_BUFFER),
    )
  }, [])

  useEffect(() => {
    if (!isInView) return
    updateStageHeight()
  }, [step, isInView, updateStageHeight])

  useEffect(() => {
    if (isPaused || total < 2) return

    const timer = window.setInterval(() => {
      setStep((current) => (current + 1) % total)
    }, AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [isPaused, total])

  /**
   * Changement de slide — referme la description et relance l'autoplay si besoin.
   */
  const goTo = useCallback(
    (nextStep: number) => {
      setIsDescriptionPaused(false)
      setStep((nextStep + total * 8) % total)
    },
    [total],
  )

  /**
   * Autoplay en pause tant que la description de la carte active est ouverte.
   */
  const handleAutoplayPause = useCallback((paused: boolean) => {
    setIsDescriptionPaused(paused)
  }, [])

  /**
   * Swipe tactile : gauche = suivant, droite = précédent.
   */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || total < 2) return

    const isHorizontalGesture = (dx: number, dy: number) =>
      Math.abs(dx) >= PRESTATION_CAROUSEL_SWIPE_PX &&
      Math.abs(dx) > Math.abs(dy) * PRESTATION_CAROUSEL_SWIPE_RATIO

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return
      const touch = event.touches[0]
      touchStartRef.current = { x: touch.clientX, y: touch.clientY }
      setIsHoverPaused(true)
    }

    const onTouchMove = (event: TouchEvent) => {
      const start = touchStartRef.current
      if (!start || event.touches.length !== 1) return
      const touch = event.touches[0]
      const dx = touch.clientX - start.x
      const dy = touch.clientY - start.y
      if (
        Math.abs(dx) > 12 &&
        Math.abs(dx) > Math.abs(dy) * PRESTATION_CAROUSEL_SWIPE_RATIO
      ) {
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

      if (dx < 0) {
        goTo(step + 1)
      } else {
        goTo(step - 1)
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
  }, [goTo, step, total])

  if (total === 0) return null

  return (
    <div
      ref={visibilityRef}
      className="prestation-carousel"
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
    >
      <div
        ref={stageRef}
        className="prestation-carousel__stage"
        role="list"
        aria-label={`${sectionLabel} — glissez pour changer de prestation`}
        style={{ height: stageHeight }}
      >
        {cards.map((card, cardIndex) => {
          const offset = getPrestationCardOffset(cardIndex, step, total)
          const slot = getPrestationCarouselSlot(offset, total)
          const isActive = slot === '0'

          return (
            <div
              key={card.id}
              ref={isActive ? activeItemRef : undefined}
              className={`prestation-carousel__item prestation-carousel__item--${slot}`}
              role="listitem"
              aria-hidden={!isActive}
            >
              <HomePrestationCard
                card={card}
                isCarouselActive={isActive}
                inCarousel
                carouselStep={step}
                onLayoutChange={isActive ? updateStageHeight : undefined}
                onAutoplayPause={isActive ? handleAutoplayPause : undefined}
              />
            </div>
          )
        })}
      </div>

      {total > 1 && (
        <div
          className="prestation-carousel__controls"
          aria-label={`Navigation ${sectionLabel}`}
        >
          <button
            type="button"
            className="prestation-carousel__btn"
            onClick={() => goTo(step - 1)}
            aria-label="Prestation précédente"
          >
            ‹
          </button>
          <div className="prestation-carousel__dots" role="tablist">
            {cards.map((card, index) => (
              <button
                key={card.id}
                type="button"
                role="tab"
                className={`prestation-carousel__dot${step === index ? ' prestation-carousel__dot--active' : ''}`}
                aria-selected={step === index}
                aria-label={`Afficher ${card.title}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className="prestation-carousel__btn"
            onClick={() => goTo(step + 1)}
            aria-label="Prestation suivante"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
