import { assetPath } from '@/lib/assets'

/** Carte prestation — image, titre, description repliable */
export type PrestationCard = {
  id: string
  title: string
  description: string
  image: string
  href?: string
}

/** Section prestations (vidéo bandeau + grille de cartes) */
export type PrestationSectionConfig = {
  id: string
  title: string
  subtitle: string
  video: string
  cards: PrestationCard[]
}

const chouchouterBase = ['pages', 'home', 'chouchouter', 'cards', 'images'] as const
const coacherBase = ['pages', 'home', 'coacher', 'cards', 'images'] as const
const divertirBase = ['pages', 'home', 'divertir', 'cards', 'images'] as const

export const HOME_CHOUCHOUTER_SECTION_ID = 'se-chouchouter'
export const HOME_COACHER_SECTION_ID = 'se-coacher'
export const HOME_DIVERTIR_SECTION_ID = 'se-divertir'

export const homePrestationSections: PrestationSectionConfig[] = [
  {
    id: HOME_CHOUCHOUTER_SECTION_ID,
    title: 'Pour se faire Chouchouter',
    subtitle: 'MakeUp et soins',
    video: assetPath('pages', 'home', 'chouchouter', 'videos', 'chouchouter.mp4'),
    cards: [
      {
        id: 'maquillage',
        title: 'Maquillage',
        description:
          'Nous sublimons votre beauté en écoutant vos envies, tout en nous adaptant à vos habitudes. Faites-vous maquiller pour une soirée élégante, une journée décontractée, ou pour toute occasion.',
        image: assetPath(...chouchouterBase, 'maquillage.png'),
        href: 'https://maoyalille.fr/faites-vous-maquiller/',
      },
      {
        id: 'mariee',
        title: 'La Mariée & son entourage',
        description:
          'Pour tous les styles : du plus naturel au plus sophistiqué. Nous réalisons un essai approfondi pour vous donner différents choix. Le déplacement est possible pour votre jour J, et nous pouvons maquiller vos proches.',
        image: assetPath(...chouchouterBase, 'mariee.png'),
        href: 'https://maoyalille.fr/future-mariee/',
      },
      {
        id: 'feminisation',
        title: 'Maquillage Féminisation Transidentité',
        description:
          'Les ateliers sont conçus pour vous guider dans le choix du maquillage, des couleurs et des styles de perruques qui mettent en valeur votre teint.',
        image: assetPath(...chouchouterBase, 'feminisation.png'),
        href: 'https://maoyalille.fr/les-soins-beautes/maquillage-personne-transgenre-en-transition/',
      },
      {
        id: 'beaute-regard',
        title: 'Beauté du regard',
        description:
          "Offrez-vous un résultat saisissant avec une pose d'extensions de cils personnalisée avec Fanny, ou tentez le réhaussement de cils : vos cils en plus courbés et définis pendant 2 mois. Nous pratiquons également la teinture de cils et de sourcils.",
        image: assetPath(...chouchouterBase, 'beaute-regard.png'),
        href: 'https://maoyalille.fr/beaute-du-rega/',
      },
      {
        id: 'soin-visage',
        title: 'Soin du Visage',
        description:
          "L'hydro-facial et le microneedling : dernier soin haute technologie. Réalisé par notre partenaire esthéticienne, un soin en profondeur pour une peau éliminée des impuretés et un coup d'éclat durable.",
        image: assetPath(...chouchouterBase, 'soin-visage.png'),
        href: 'https://maoyalille.fr/soins-du-visage-derniere-technologiesoins-du-visage/',
      },
      {
        id: 'shooting-photo',
        title: 'Shooting photo',
        description:
          'Notre coin photo vous permet d\'immortaliser vos moments beauté. Obtenez des portraits pleins d\'émotions grâce à notre photographe, ou venez poser avec Fanny qui vous guidera pour vous sentir comme une star.',
        image: assetPath(...chouchouterBase, 'shooting-photo.jpeg'),
        href: 'https://maoyalille.fr/notre-partenaire-photographe/',
      },
      {
        id: 'blanchiment-dentaire',
        title: 'Blanchiment dentaire',
        description:
          "Cette méthode innovante respecte l'émail de vos dents tout en vous offrant un sourire éclatant. Séance de 20 à 60 minutes, à réaliser sur place dans une ambiance cocooning.",
        image: assetPath(...chouchouterBase, 'blanchiment-dentaire.png'),
        href: 'https://maoyalille.fr/blanchiment-dentaire-lille/',
      },
      {
        id: 'beaute-ongles',
        title: 'Beauté des ongles',
        description:
          'NOUVEAUTÉ ! avec Cloé — infos et rendez-vous par mail ou téléphone au 03 59 51 87 71.',
        image: assetPath(...chouchouterBase, 'beaute-ongles.jpeg'),
      },
    ],
  },
  {
    id: HOME_COACHER_SECTION_ID,
    title: 'Pour se faire Coacher',
    subtitle: 'MakeUp et conseils en image',
    video: assetPath('pages', 'home', 'coacher', 'videos', 'coacher.mp4'),
    cards: [
      {
        id: 'ateliers-makeup',
        title: 'Ateliers Makeup',
        description:
          'Une expérience enrichissante et amusante : nos experts vous guident avec douceur et vous proposent des astuces faciles à reproduire chez vous.',
        image: assetPath(...coacherBase, 'ateliers-makeup.png'),
        href: 'https://maoyalille.fr/cours-de-maquillage/',
      },
      {
        id: 'colorimetrie',
        title: 'Conseil Colorimétrie',
        description:
          'Découvrez les teintes qui complètent votre teint, vos yeux et vos cheveux pour renforcer votre confiance au quotidien.',
        image: assetPath(...coacherBase, 'colorimetrie.png'),
        href: 'https://maoyalille.fr/conseil-colorimetrie-9193/',
      },
      {
        id: 'conseil-image',
        title: 'Conseil en Image',
        description:
          'Notre experte vous accompagne dans votre évolution capillaire et explore avec vous les techniques modernes qui mettent en valeur vos traits.',
        image: assetPath(...coacherBase, 'conseil-image.png'),
        href: 'https://maoyalille.fr/conseil-en-image/',
      },
      {
        id: 'conseil-look',
        title: 'Conseil Look',
        description:
          'À votre style personnel : palettes de couleurs, coupes et styles qui reflètent votre personnalité, pour plus de confort et de confiance en soi.',
        image: assetPath(...coacherBase, 'conseil-look.png'),
        href: 'https://maoyalille.fr/atelier-shopping/',
      },
      {
        id: 'transition-feminisation',
        title: 'Atelier Transition et Féminisation',
        description:
          'Des ateliers pour vous guider dans les étapes de votre transition et des astuces pratiques qui simplifient votre routine quotidienne.',
        image: assetPath(...coacherBase, 'transition-feminisation.png'),
        href: 'https://maoyalille.fr/les-soins-beautes/maquillage-personne-transgenre-en-transition/',
      },
      {
        id: 'conseil-ado',
        title: 'Conseil en Image Adolescente',
        description:
          'Un moment conseils beauté personnalisé : soins, coiffures tendance et astuces maquillage pour développer confiance et authenticité.',
        image: assetPath(...coacherBase, 'conseil-ado.jpeg'),
        href: 'https://maoyalille.fr/atelier-ado/',
      },
      {
        id: 'atelier-maquillage-coiffure',
        title: 'Atelier Maquillage et Coiffure',
        description:
          'Maquilleuse et coiffeuse à l\'écoute de vos envies : repartez avec un look qui vous correspond, entre conseils maquillage et coiffage.',
        image: assetPath(...coacherBase, 'atelier-maquillage-coiffure.png'),
        href: 'https://maoyalille.fr/atelier-look/',
      },
      {
        id: 'soin-yoga-visage',
        title: 'Atelier Soin et Yoga du Visage',
        description:
          'Comprenez les besoins de votre peau avec des produits naturels, ou redonnez du pep\'s à votre visage grâce au yoga du visage.',
        image: assetPath(...coacherBase, 'soin-yoga-visage.png'),
        href: 'https://maoyalille.fr/atelier-soins-cocooning/',
      },
    ],
  },
  {
    id: HOME_DIVERTIR_SECTION_ID,
    title: 'Pour se Divertir',
    subtitle: 'Pour vos événements',
    video: assetPath('pages', 'home', 'divertir', 'videos', 'divertir.mp4'),
    cards: [
      {
        id: 'entre-copines',
        title: 'Entre Copines',
        description:
          'EVJF, anniversaires, moments entre copines ou collègues : ateliers beauté, cours de maquillage, conseil couleurs et soins visage pour 1 à 8 personnes.',
        image: assetPath(...divertirBase, 'entre-copines.png'),
        href: 'https://maoyalille.fr/profitez-dun-espaces-privatif/',
      },
      {
        id: 'grimage-enfants',
        title: 'Grimage Enfants',
        description:
          'Anniversaires, mariages, communions, kermesses… Vos petits se métamorphosent en princesses, licornes, pirates, lions…',
        image: assetPath(...divertirBase, 'grimage-enfants.png'),
        href: 'https://maoyalille.fr/atelier-maquillage-enfants/',
      },
      {
        id: 'animations-pro',
        title: 'Maquillage et Animations pour les professionnels',
        description:
          'Tournages, séances photo, événements : une équipe de maquilleuses certifiées, du maquillage beauté aux effets spéciaux.',
        image: assetPath(...divertirBase, 'animations-pro.png'),
        href: 'https://maoyaevent.fr/',
      },
      {
        id: 'bar-paillettes',
        title: 'Bar à makeup & Paillettes',
        description:
          'Bars makeup fluo, strass et paillettes pour illuminer festivals, EVJF, mariages, anniversaires et comités d\'entreprise.',
        image: assetPath(...divertirBase, 'bar-paillettes.png'),
        href: 'https://maoyalille.fr/atelier-maquillage-enfants/',
      },
      {
        id: 'halloween',
        title: 'Makeup Horreur / Halloween',
        description: 'Réalisation sur demande — merci de nous contacter.',
        image: assetPath(...divertirBase, 'halloween.jpeg'),
        href: 'https://maoyalille.fr/halloween',
      },
    ],
  },
]
