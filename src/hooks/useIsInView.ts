import { useEffect, useRef, useState } from 'react'

type UseIsInViewOptions = {
  threshold?: number
  rootMargin?: string
}

/**
 * Détecte si l’élément est visible dans le viewport (IntersectionObserver).
 * Utile pour mettre en pause autoplay / mesures de layout hors écran.
 */
export function useIsInView<T extends HTMLElement = HTMLDivElement>(
  options: UseIsInViewOptions = {},
) {
  const { threshold = 0.12, rootMargin = '0px' } = options
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold, rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isInView }
}
