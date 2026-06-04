import { useEffect, useState } from 'react'

/** Ligne de détection sous le header (px depuis le haut du viewport) */
const SCROLL_MARKER_OFFSET_PX = 96

/**
 * Détecte la section active au scroll — dernière section dont le haut
 * est passé sous le repère (évite de sauter une section courte comme Univers).
 */
export function useActiveNavSection(sectionIds: string[]) {
  const [activeSectionId, setActiveSectionId] = useState(
    sectionIds[0] ?? '',
  )

  useEffect(() => {
    if (!sectionIds.length) return

    const resolveActiveSection = () => {
      const marker = SCROLL_MARKER_OFFSET_PX
      let currentId = sectionIds[0]

      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId)
        if (!element) continue

        if (element.getBoundingClientRect().top <= marker) {
          currentId = sectionId
        }
      }

      const nearPageBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 48

      if (nearPageBottom) {
        currentId = sectionIds[sectionIds.length - 1] ?? currentId
      }

      setActiveSectionId((previous) =>
        previous === currentId ? previous : currentId,
      )
    }

    resolveActiveSection()
    window.addEventListener('scroll', resolveActiveSection, { passive: true })
    window.addEventListener('resize', resolveActiveSection)

    return () => {
      window.removeEventListener('scroll', resolveActiveSection)
      window.removeEventListener('resize', resolveActiveSection)
    }
  }, [sectionIds])

  return activeSectionId
}
