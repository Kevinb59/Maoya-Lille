import './SectionPlaceholder.css'

type SectionPlaceholderProps = {
  label?: string
  minHeight?: string
}

/**
 * Fallback Suspense / lazy — réserve l’espace sans bloquer le scroll.
 */
export function SectionPlaceholder({
  label = 'Chargement…',
  minHeight = '40vh',
}: SectionPlaceholderProps) {
  return (
    <div
      className="section-placeholder"
      style={{ minHeight }}
      aria-hidden="true"
    >
      <span className="section-placeholder__label">{label}</span>
    </div>
  )
}
