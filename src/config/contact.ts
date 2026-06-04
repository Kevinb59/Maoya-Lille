import { contactPhone as contactPhoneRaw } from '@/config/env'

/**
 * Numéro affiché dans le menu (ex. 03 59 51 87 71).
 */
export function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '')

  if (digits.length === 10 && digits.startsWith('0')) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
  }

  return raw
}

/**
 * Lien d'appel international pour attribut href tel:.
 */
export function formatPhoneTel(raw: string): string {
  const digits = raw.replace(/\D/g, '')

  if (digits.length === 10 && digits.startsWith('0')) {
    return `tel:+33${digits.slice(1)}`
  }

  return `tel:${digits}`
}

const phone = contactPhoneRaw || '0359518771'

export const contactPhoneDisplay = formatPhoneDisplay(phone)
export const contactPhoneHref = formatPhoneTel(phone)
