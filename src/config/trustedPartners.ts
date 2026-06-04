import { assetPath } from '@/lib/assets'

/** Identifiant DOM — carrousel logos entreprises */
export const TRUSTED_PARTNERS_SECTION_ID = 'ils-nous-ont-fait-confiance'

export type TrustedPartner = {
  id: string
  name: string
  logoFile: string
  website?: string
  /** Horodatage fichier (mtime) — tri d’affichage du plus ancien au plus récent */
  mtimeMs: number
}

const logos = (file: string) =>
  assetPath('pages', 'home', 'trusted-partners', 'logos', file)

/**
 * Partenaires — ordre = date de modification du fichier logo (ascendant).
 * Après ajout de logos : `npm run sync:trusted-partners` pour régénérer les mtime.
 */
export const trustedPartners: TrustedPartner[] = [
  {
    id: 'ville-de-lille',
    name: 'Ville de Lille',
    logoFile: logos('ville-de-lille.webp'),
    website: 'https://www.lille.fr',
    mtimeMs: 1780594068345,
  },
  {
    id: 'paris-2024',
    name: 'Paris 2024',
    logoFile: logos('paris-2024.webp'),
    website: 'https://www.olympics.com/fr/olympic-games/paris-2024',
    mtimeMs: 1780594196780,
  },
  {
    id: 'mhn-lille',
    name: "Musée d'Histoire Naturelle de Lille",
    logoFile: logos('mhn-lille.webp'),
    website: 'https://mhn.lille.fr',
    mtimeMs: 1780594626762,
  },
  {
    id: '1pulse9-events',
    name: '1Pulse9 Events',
    logoFile: logos('1pulse9-events.webp'),
    website: 'https://www.1pulse9-events.fr',
    mtimeMs: 1780594835249,
  },
  {
    id: 'universite-lille',
    name: 'Université de Lille',
    logoFile: logos('universite-lille.webp'),
    website: 'https://www.univ-lille.fr',
    mtimeMs: 1780595065658,
  },
  {
    id: 'saint-andre-lez-lille',
    name: 'Saint-André-lez-Lille',
    logoFile: logos('saint-andre-lez-lille.webp'),
    website: 'https://www.saintandrelezlille.fr',
    mtimeMs: 1780595265895,
  },
  {
    id: 'kiabi',
    name: 'Kiabi',
    logoFile: logos('kiabi.webp'),
    website: 'https://www.kiabi.com',
    mtimeMs: 1780595357828,
  },
  {
    id: 'smythstoys',
    name: 'Smyths Toys',
    logoFile: logos('smythstoys.webp'),
    website: 'https://www.smythstoys.com/fr/fr-fr',
    mtimeMs: 1780595460497,
  },
  {
    id: 'mesa-club-lille',
    name: 'Mesa Club Lille',
    logoFile: logos('mesa-club-lille.webp'),
    website: 'https://www.mesa-lille.com',
    mtimeMs: 1780595607992,
  },
  {
    id: 'leclerc',
    name: 'E.Leclerc',
    logoFile: logos('leclerc.webp'),
    website: 'https://www.e.leclerc/',
    mtimeMs: 1780595776068,
  },
  {
    id: 'bmw',
    name: 'BMW',
    logoFile: logos('bmw.webp'),
    website: 'https://www.bmw.fr',
    mtimeMs: 1780595860106,
  },
  {
    id: 'bonprix',
    name: 'bonprix',
    logoFile: logos('bonprix.webp'),
    website: 'https://www.bonprix.fr',
    mtimeMs: 1780595932058,
  },
  {
    id: 'kiloutou',
    name: 'Kiloutou',
    logoFile: logos('kiloutou.webp'),
    website: 'https://www.kiloutou.fr',
    mtimeMs: 1780596147772,
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logoFile: logos('amazon.webp'),
    website: 'https://www.amazon.fr',
    mtimeMs: 1780596276468,
  },
  {
    id: 'goodays',
    name: 'Goodays',
    logoFile: logos('goodays.webp'),
    website: 'https://www.goodays.co',
    mtimeMs: 1780596372347,
  },
  {
    id: 'maison-folie-lille',
    name: 'La Maison Folie Lille',
    logoFile: logos('maison-folie-lille.webp'),
    website: 'https://maisonsfolie.lille.fr/',
    mtimeMs: 1780596533362,
  },
  {
    id: 'nkp-danse',
    name: 'NKP Danse',
    logoFile: logos('nkp-danse.webp'),
    website: 'https://www.facebook.com/nkpdanse/?locale=fr_FR',
    mtimeMs: 1780596652616,
  },
  {
    id: 'roquette',
    name: 'Roquette',
    logoFile: logos('roquette.webp'),
    website: 'https://www.roquette.com',
    mtimeMs: 1780597089170,
  },
  {
    id: 'douai',
    name: 'Ville de Douai',
    logoFile: logos('douai.webp'),
    website: 'https://www.douai.fr',
    mtimeMs: 1780597179192,
  },
  {
    id: 'leroy-merlin',
    name: 'Leroy Merlin',
    logoFile: logos('leroy-merlin.webp'),
    website: 'https://www.leroymerlin.fr',
    mtimeMs: 1780597257248,
  },
  {
    id: 'auchan',
    name: 'Centre Commercial Aushopping V2',
    logoFile: logos('auchan-v2.webp'),
    website: 'https://v2.aushopping.com/',
    mtimeMs: 1780597431511,
  },
]

/** Tri par date de modification du fichier logo (plus ancien → plus récent) */
export function getTrustedPartnersSorted(): TrustedPartner[] {
  return [...trustedPartners].sort((a, b) => a.mtimeMs - b.mtimeMs)
}
