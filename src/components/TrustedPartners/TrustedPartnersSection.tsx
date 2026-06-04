import { useMemo } from 'react'
import {
  getTrustedPartnersSorted,
  TRUSTED_PARTNERS_SECTION_ID,
} from '@/config/trustedPartners'
import { TrustedPartnerItem } from './TrustedPartnerItem'
import './TrustedPartnersSection.css'

type MarqueeTrackProps = {
  partners: ReturnType<typeof getTrustedPartnersSorted>
  direction: 'left' | 'right'
}

/**
 * Piste défilante — contenu dupliqué pour boucle infinie fluide.
 */
function MarqueeTrack({ partners, direction }: MarqueeTrackProps) {
  const loopItems = useMemo(() => [...partners, ...partners], [partners])

  return (
    <div
      className={`trusted-partners__track trusted-partners__track--${direction}`}
      aria-hidden={false}
    >
      <div className="trusted-partners__track-inner">
        {loopItems.map((partner, index) => (
          <TrustedPartnerItem
            key={`${partner.id}-${index}`}
            partner={partner}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Carrousel logos entreprises — 1 ligne desktop, 2 lignes opposées mobile.
 */
export function TrustedPartnersSection() {
  const partners = useMemo(() => getTrustedPartnersSorted(), [])

  const rowSecond = useMemo(() => [...partners].reverse(), [partners])

  return (
    <section
      id={TRUSTED_PARTNERS_SECTION_ID}
      className="trusted-partners"
      aria-labelledby="trusted-partners-title"
    >
      <div className="trusted-partners__container">
        <header className="trusted-partners__header">
          <h2 id="trusted-partners-title" className="trusted-partners__title">
            Ils nous ont fait confiance
          </h2>
          <p className="trusted-partners__subtitle">
            Entreprises, marques et professionnelles qui nous ont choisies.
          </p>
        </header>

        <div className="trusted-partners__viewport">
          <div className="trusted-partners__fade trusted-partners__fade--left" aria-hidden />
          <div className="trusted-partners__fade trusted-partners__fade--right" aria-hidden />

          <div className="trusted-partners__rows">
            <MarqueeTrack partners={partners} direction="left" />
            <MarqueeTrack partners={rowSecond} direction="right" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustedPartnersSection
