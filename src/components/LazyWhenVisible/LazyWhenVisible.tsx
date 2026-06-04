import { useEffect, useState, type ReactNode } from 'react'
import { useIsInView } from '@/hooks/useIsInView'
import './LazyWhenVisible.css'

type LazyWhenVisibleProps = {
  children: ReactNode
  fallback?: ReactNode
  /** Hauteur minimale pour limiter le saut de layout */
  minHeight?: string
  rootMargin?: string
  className?: string
}

/**
 * Ne monte les enfants (et donc leurs imports lazy) qu’à l’approche du viewport.
 */
export function LazyWhenVisible({
  children,
  fallback = null,
  minHeight = '1px',
  rootMargin = '200px',
  className = '',
}: LazyWhenVisibleProps) {
  const { ref, isInView } = useIsInView({ rootMargin, threshold: 0 })
  const [hasActivated, setHasActivated] = useState(false)

  useEffect(() => {
    if (isInView) setHasActivated(true)
  }, [isInView])

  return (
    <div
      ref={ref}
      className={`lazy-when-visible${className ? ` ${className}` : ''}`}
      style={{ minHeight }}
    >
      {hasActivated ? children : fallback}
    </div>
  )
}
