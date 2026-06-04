import { socialLinks } from '@/config/social'
import './SiteHeaderSocial.css'

/**
 * Icônes Instagram / Facebook à droite du numéro de téléphone.
 * Couleur synchronisée avec le menu (clair sur vidéo → sombre au scroll).
 */
export function SiteHeaderSocial() {
  const networks = [
    { id: 'instagram', ...socialLinks.instagram },
    { id: 'facebook', ...socialLinks.facebook },
  ] as const

  return (
    <ul className="site-header-social" aria-label="Réseaux sociaux">
      {networks.map((network) => (
        <li key={network.id}>
          <a
            href={network.href || '#'}
            className="site-header-social__link"
            aria-label={network.label}
            target="_blank"
            rel="noopener noreferrer"
            {...(network.href ? {} : { 'aria-disabled': true, tabIndex: -1 })}
          >
            <span
              className={`site-header-social__icon site-header-social__icon--${network.id}`}
              style={{
                maskImage: `url(${network.icon})`,
                WebkitMaskImage: `url(${network.icon})`,
              }}
              aria-hidden="true"
            />
          </a>
        </li>
      ))}
    </ul>
  )
}
