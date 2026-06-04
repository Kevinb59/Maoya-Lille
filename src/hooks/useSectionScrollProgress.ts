import { useEffect, useState } from 'react'

/**
 * Calcule la progression du scroll à l'intérieur d'une section (0 → début, 1 → fin).
 * Utilisé pour faire apparaître progressivement le fond du menu en fin de hero.
 */
export function useSectionScrollProgress(sectionId: string): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const section = document.getElementById(sectionId)
    if (!section) return

    const updateProgress = () => {
      const rect = section.getBoundingClientRect()
      const sectionHeight = section.offsetHeight

      // Distance parcourue depuis le haut de la section (0 quand le haut est visible)
      const scrolledInSection = Math.min(Math.max(-rect.top, 0), sectionHeight)
      const nextProgress =
        sectionHeight > 0 ? scrolledInSection / sectionHeight : 0

      setProgress(Math.min(Math.max(nextProgress, 0), 1))
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [sectionId])

  return progress
}
