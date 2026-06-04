import { lazy, Suspense } from 'react'
import { HOME_GIFT_CARD_SECTION_ID, homeIntroContent } from '@/config/homeIntro'
import { useDeferredMedia } from '@/hooks/useDeferredMedia'
import './HomeIntroSection.css'

const GiftCard3D = lazy(() => import('@/components/GiftCard3D'))

/**
 * Section carte cadeau — titre, colonne texte à gauche, carte 3D à droite.
 * WebGL monté uniquement quand la section approche du viewport.
 */
export function HomeIntroSection() {
  const { ref: giftSlotRef, shouldLoad: shouldMount3d } = useDeferredMedia({
    rootMargin: '120px',
  })

  return (
    <section
      id={HOME_GIFT_CARD_SECTION_ID}
      className="home-intro"
      aria-labelledby="home-intro-title"
    >
      <div className="home-intro__container">
        <div className="home-intro__grid">
          <div className="home-intro__content">
            <h2 id="home-intro-title" className="home-intro__title">
              {homeIntroContent.title}
            </h2>
            <p className="home-intro__subtitle">{homeIntroContent.subtitle}</p>
            <p className="home-intro__description">{homeIntroContent.description}</p>
            <a
              className="home-intro__cta"
              href={homeIntroContent.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {homeIntroContent.ctaLabel}
            </a>
          </div>

          <div ref={giftSlotRef} className="home-intro__gift-slot">
            {shouldMount3d ? (
              <Suspense
                fallback={
                  <div className="home-intro__gift-card home-intro__gift-card--loading">
                    Chargement de la carte…
                  </div>
                }
              >
                <GiftCard3D className="home-intro__gift-card" />
              </Suspense>
            ) : (
              <div
                className="home-intro__gift-card home-intro__gift-card--loading"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
