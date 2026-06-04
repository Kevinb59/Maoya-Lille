import { useCallback, useEffect, useRef, useState } from 'react'
import type { PrestationSectionConfig } from '@/config/homePrestations'
import { useDeferredMedia } from '@/hooks/useDeferredMedia'
import { HomePrestationCard } from './HomePrestationCard'
import { HomePrestationMobileCarousel } from './HomePrestationMobileCarousel'
import './HomePrestationSection.css'

type HomePrestationSectionProps = {
  config: PrestationSectionConfig
}

/**
 * Section prestations : bandeau vidéo (hauteur modérée) + grille de cartes.
 * Vidéo chargée et lue uniquement à l’approche du viewport.
 */
export function HomePrestationSection({ config }: HomePrestationSectionProps) {
  const { ref: heroRef, isInView, shouldLoad: shouldLoadVideo } = useDeferredMedia({
    rootMargin: '160px',
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  const handleVideoCanPlay = useCallback(() => {
    setVideoReady(true)
    videoRef.current?.play().catch(() => {
      /* Autoplay bloqué — dégradé de secours */
    })
  }, [])

  const handleVideoError = useCallback(() => {
    setVideoFailed(true)
  }, [])

  /* Pause hors écran pour libérer le décodeur */
  useEffect(() => {
    const video = videoRef.current
    if (!video || videoFailed || !videoReady) return

    if (isInView) {
      video.play().catch(() => {})
      return
    }

    video.pause()
  }, [isInView, videoReady, videoFailed])

  const showVideo = !videoFailed && shouldLoadVideo

  return (
    <section
      id={config.id}
      className="prestation-section"
      aria-labelledby={`${config.id}-title`}
    >
      <header ref={heroRef} className="prestation-hero">
        <div
          className={`prestation-hero__media${videoReady ? ' prestation-hero__media--ready' : ''}${videoFailed ? ' prestation-hero__media--fallback' : ''}`}
          aria-hidden="true"
        >
          {showVideo && (
            <video
              ref={videoRef}
              className="prestation-hero__video"
              muted
              playsInline
              loop
              autoPlay
              preload="metadata"
              onCanPlay={handleVideoCanPlay}
              onError={handleVideoError}
            >
              <source src={config.video} type="video/mp4" />
            </video>
          )}
        </div>

        <div className="prestation-hero__overlay" aria-hidden="true" />

        <div className="prestation-hero__content">
          <h2 id={`${config.id}-title`} className="prestation-hero__title">
            {config.title}
          </h2>
          <p className="prestation-hero__subtitle">{config.subtitle}</p>
        </div>
      </header>

      <div className="prestation-section__body">
        <div className="prestation-section__container">
          <ul className="prestation-grid" role="list">
            {config.cards.map((card) => (
              <li key={card.id} className="prestation-grid__item" role="listitem">
                <HomePrestationCard card={card} />
              </li>
            ))}
          </ul>
        </div>

        <HomePrestationMobileCarousel
          cards={config.cards}
          sectionLabel={config.title}
        />
      </div>
    </section>
  )
}
