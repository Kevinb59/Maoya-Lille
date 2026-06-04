/**
 * Accès centralisé aux variables Vite (préfixe VITE_).
 * Les valeurs proviennent de .env.local en dev et des variables Vercel en production.
 */

// URL canonique du site
export const siteUrl = import.meta.env.VITE_SITE_URL ?? ''

// Coordonnées affichées sur le site
export const contactEmail = import.meta.env.VITE_CONTACT_EMAIL ?? ''
export const contactPhone =
  import.meta.env.VITE_CONTACT_PHONE ?? '0359518771'
