import { assetPath } from '@/lib/assets'

/**
 * Liens et icônes des réseaux sociaux (header, footer…).
 */
export const socialLinks = {
  instagram: {
    label: 'Instagram Maoya MakeUp',
    href: import.meta.env.VITE_INSTAGRAM_URL ?? '',
    icon: assetPath('shared', 'social', 'icons', 'instagram.svg'),
  },
  facebook: {
    label: 'Facebook Maoya MakeUp',
    href: import.meta.env.VITE_FACEBOOK_URL ?? '',
    icon: assetPath('shared', 'social', 'icons', 'facebook.svg'),
  },
} as const

export const socialNetworks = Object.values(socialLinks).filter(
  (network) => network.href.length > 0,
)
