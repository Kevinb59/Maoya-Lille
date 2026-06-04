import type { GoogleReview } from '@/config/googleReviews'
import { GoogleReviewsStars } from './GoogleReviewsStars'
import './ReviewCard.css'

const AVATAR_COLORS = [
  '#8b4a6b',
  '#6d3554',
  '#a86b88',
  '#5c7a8a',
  '#7a5c8a',
]

type ReviewCardProps = {
  review: GoogleReview
}

/** Initiales à partir du nom affiché (ex. « Claire D. » → CD). */
export function getInitials(name: string): string {
  const parts = name
    .replace(/\./g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

/**
 * Carte d’un avis Google — avatar, note, texte, mention Google.
 */
export function ReviewCard({ review }: ReviewCardProps) {
  const initials = getInitials(review.author)
  const bg = avatarColor(review.author)

  return (
    <article className="google-review-card">
      <header className="google-review-card__header">
        <div
          className="google-review-card__avatar"
          style={{ backgroundColor: bg }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="google-review-card__meta">
          <p className="google-review-card__author">{review.author}</p>
          <time className="google-review-card__date" dateTime={review.date}>
            {review.date}
          </time>
        </div>
        <span className="google-review-card__google-mark" aria-label="Avis Google">
          <GoogleGIcon />
        </span>
      </header>

      <div className="google-review-card__rating-row">
        <GoogleReviewsStars rating={review.rating} size="sm" />
        <span className="google-review-card__verified" aria-hidden="true" title="Avis Google">
          ✓
        </span>
      </div>

      <p className="google-review-card__text">{review.text}</p>
      <span className="google-review-card__more">Lire la suite</span>
    </article>
  )
}

function GoogleGIcon() {
  return (
    <svg
      className="google-review-card__google-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
