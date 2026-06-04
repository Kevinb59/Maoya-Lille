import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fallbackReviews,
  googleSummary,
  GOOGLE_REVIEWS_SECTION_ID,
  type GoogleReview,
  type GoogleReviewsSummary,
} from '@/config/googleReviews'
import { GoogleReviewsStars } from './GoogleReviewsStars'
import { ReviewCard } from './ReviewCard'
import './GoogleReviews.css'

/** Passer à true quand l’endpoint Vercel /api/google-reviews sera prêt */
const USE_GOOGLE_REVIEWS_API = false

const CAROUSEL_SCROLL_PX = 256

/**
 * Section avis Google — données locales (maquette), prête pour l’API Vercel.
 */
export function GoogleReviews() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [reviews, setReviews] = useState<GoogleReview[]>(fallbackReviews)
  const [summary, setSummary] = useState<GoogleReviewsSummary>(googleSummary)

  useEffect(() => {
    if (!USE_GOOGLE_REVIEWS_API) return

    let cancelled = false

    const loadReviews = async () => {
      // TODO API Google Places :
      // Plus tard, remplacer les données locales par un fetch vers /api/google-reviews.
      // En cas d’erreur API, conserver fallbackReviews comme données de secours.
      // Ne jamais appeler Google Places directement depuis le frontend.
      try {
        const response = await fetch('/api/google-reviews')

        if (!response.ok) {
          throw new Error('Réponse API invalide')
        }

        const data = (await response.json()) as {
          reviews?: GoogleReview[]
          summary?: GoogleReviewsSummary
        }

        if (cancelled) return

        if (data.reviews?.length) {
          setReviews(data.reviews)
        }

        if (data.summary) {
          setSummary(data.summary)
        }
      } catch {
        if (!cancelled) {
          setReviews(fallbackReviews)
          setSummary(googleSummary)
        }
      }
    }

    void loadReviews()

    return () => {
      cancelled = true
    }
  }, [])

  const scrollCarousel = useCallback((direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return

    track.scrollBy({
      left: direction * CAROUSEL_SCROLL_PX,
      behavior: 'smooth',
    })
  }, [])

  return (
    <section
      id={GOOGLE_REVIEWS_SECTION_ID}
      className="google-reviews"
      aria-labelledby="google-reviews-title"
    >
      <div className="google-reviews__container">
        <header className="google-reviews__intro">
          <h2 id="google-reviews-title" className="google-reviews__title">
            Ce que vous en pensez
          </h2>
          <p className="google-reviews__subtitle">
            Avis authentiques laissés par nos clientes sur Google.
          </p>
        </header>

        <div className="google-reviews__layout">
          <aside className="google-reviews__summary" aria-label="Note Google">
            <p className="google-reviews__summary-label">Excellent</p>
            <GoogleReviewsStars
              rating={summary.rating}
              size="lg"
              label={`${summary.rating} sur 5`}
            />
            <p className="google-reviews__summary-score">
              <span className="google-reviews__summary-value">
                {summary.rating.toFixed(1).replace('.', ',')}
              </span>
              <span className="google-reviews__summary-max"> / 5</span>
            </p>
            <p className="google-reviews__summary-count">
              Basé sur {summary.totalReviews} avis Google
            </p>
            <p className="google-reviews__summary-business">{summary.businessName}</p>
            <GoogleLogo />
          </aside>

          <div className="google-reviews__carousel-wrap">
            <button
              type="button"
              className="google-reviews__nav google-reviews__nav--prev"
              onClick={() => scrollCarousel(-1)}
              aria-label="Avis précédents"
            >
              ‹
            </button>

            <div
              ref={trackRef}
              className="google-reviews__track"
              role="list"
              aria-label="Liste des avis clients"
            >
              {reviews.map((review) => (
                <div key={review.id} className="google-reviews__slide" role="listitem">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="google-reviews__nav google-reviews__nav--next"
              onClick={() => scrollCarousel(1)}
              aria-label="Avis suivants"
            >
              ›
            </button>
          </div>
        </div>

        <footer className="google-reviews__footer">
          <p className="google-reviews__attribution">
            Avis collectés via Google ·{' '}
            <span className="google-reviews__attribution-brand">Google</span>
          </p>
          <a
            className="google-reviews__cta"
            href={summary.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir tous les avis sur Google
          </a>
        </footer>
      </div>
    </section>
  )
}

function GoogleLogo() {
  return (
    <svg
      className="google-reviews__google-logo"
      viewBox="0 0 74 24"
      width="74"
      height="24"
      aria-hidden="true"
    >
      <text x="0" y="17" fontSize="16" fontFamily="Arial, sans-serif" fontWeight="700">
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#EA4335">o</tspan>
        <tspan fill="#FBBC05">o</tspan>
        <tspan fill="#4285F4">g</tspan>
        <tspan fill="#34A853">l</tspan>
        <tspan fill="#EA4335">e</tspan>
      </text>
    </svg>
  )
}

export default GoogleReviews
