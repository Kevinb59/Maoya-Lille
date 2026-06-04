import { useState } from 'react'
import type { TrustedPartner } from '@/config/trustedPartners'
import './TrustedPartnerItem.css'

type TrustedPartnerItemProps = {
  partner: TrustedPartner
}

/**
 * Carte logo + nom — lien externe si un site est renseigné.
 */
export function TrustedPartnerItem({ partner }: TrustedPartnerItemProps) {
  const [logoFailed, setLogoFailed] = useState(false)

  const body = (
    <>
      <div className="trusted-partner__logo-wrap">
        {!logoFailed ? (
          <img
            src={partner.logoFile}
            alt=""
            className="trusted-partner__logo"
            loading="lazy"
            decoding="async"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className="trusted-partner__fallback" aria-hidden="true">
            {partner.name.charAt(0)}
          </span>
        )}
      </div>
      <p className="trusted-partner__name">{partner.name}</p>
    </>
  )

  if (partner.website) {
    return (
      <a
        className="trusted-partner"
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${partner.name} — ouvrir le site`}
      >
        {body}
      </a>
    )
  }

  return <div className="trusted-partner">{body}</div>
}
