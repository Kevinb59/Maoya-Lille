import './GoogleReviewsStars.css'

type GoogleReviewsStarsProps = {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

/**
 * Affiche jusqu’à 5 étoiles (pleines / demi / vides) selon la note.
 */
export function GoogleReviewsStars({
  rating,
  size = 'md',
  label,
}: GoogleReviewsStarsProps) {
  const clamped = Math.min(5, Math.max(0, rating))

  return (
    <div
      className={`google-reviews-stars google-reviews-stars--${size}`}
      role="img"
      aria-label={label ?? `Note : ${clamped} sur 5`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1
        const filled = clamped >= starValue
        const half = !filled && clamped >= starValue - 0.5

        return (
          <span
            key={starValue}
            className={`google-reviews-stars__star${filled ? ' google-reviews-stars__star--full' : ''}${half ? ' google-reviews-stars__star--half' : ''}`}
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}
