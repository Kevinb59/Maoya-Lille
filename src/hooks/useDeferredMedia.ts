import { useEffect, useState } from 'react'
import { useIsInView } from '@/hooks/useIsInView'

type UseDeferredMediaOptions = {
  /** Pré-charge un peu avant l’entrée dans le viewport */
  rootMargin?: string
  threshold?: number
}

/**
 * Retarde le chargement des médias lourds (vidéo, WebGL) jusqu’à proximité du viewport.
 * shouldLoad reste true une fois activé (pas de démontage au scroll).
 */
export function useDeferredMedia<T extends HTMLElement = HTMLDivElement>(
  options: UseDeferredMediaOptions = {},
) {
  const { rootMargin = '180px', threshold = 0.08 } = options
  const { ref, isInView } = useIsInView<T>({ rootMargin, threshold })
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (isInView) setShouldLoad(true)
  }, [isInView])

  return { ref, isInView, shouldLoad }
}
