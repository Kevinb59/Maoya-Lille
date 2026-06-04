# Clients professionnels — référence

Fichiers logos : `public/assets/pages/home/trusted-partners/logos/`
Config site : `src/config/trustedPartners.ts` (champs `name`, `website`, `mtimeMs`)

| #   | id config               | Fichier logo                 | Nom affiché                         | Site web                                             |
| --- | ----------------------- | ---------------------------- | ----------------------------------- | ---------------------------------------------------- |
| 1   | `ville-de-lille`        | `ville-de-lille.webp`        | Ville de Lille                      | https://www.lille.fr                                 |
| 2   | `paris-2024`            | `paris-2024.webp`            | Paris 2024                          | https://www.olympics.com/fr/olympic-games/paris-2024 |
| 3   | `mhn-lille`             | `mhn-lille.webp`             | Musée d'Histoire Naturelle de Lille | https://mhn.lille.fr                                 |
| 4   | `1pulse9-events`        | `1pulse9-events.webp`        | 1Pulse9 Events                      | https://www.1pulse9-events.fr                        |
| 5   | `universite-lille`      | `universite-lille.webp`      | Université de Lille                 | https://www.univ-lille.fr                            |
| 6   | `saint-andre-lez-lille` | `saint-andre-lez-lille.webp` | Saint-André-lez-Lille               | https://www.villesaintandre.fr/                      |
| 7   | `kiabi`                 | `kiabi.webp`                 | Kiabi                               | https://www.kiabi.com                                |
| 8   | `smythstoys`            | `smythstoys.webp`            | Smyths Toys                         | https://www.smythstoys.com/fr/fr-fr                  |
| 9   | `mesa-club-lille`       | `mesa-club-lille.webp`       | Mesa Club Lille                     | https://www.mesa-lille.com                           |
| 10  | `leclerc`               | `leclerc.webp`               | E.Leclerc                           | https://www.e.leclerc/                               |
| 11  | `bmw`                   | `bmw.webp`                   | BMW                                 | https://www.bmw.fr                                   |
| 12  | `bonprix`               | `bonprix.webp`               | bonprix                             | https://www.bonprix.fr                               |
| 13  | `kiloutou`              | `kiloutou.webp`              | Kiloutou                            | https://www.kiloutou.fr                              |
| 14  | `amazon`                | `amazon.webp`                | Amazon                              | https://www.amazon.fr                                |
| 15  | `goodays`               | `goodays.webp`               | Goodays                             | https://www.goodays.co                               |
| 16  | `maison-folie-lille`    | `maison-folie-lille.webp`    | La Maison Folie Lille               | https://maisonsfolie.lille.fr/                       |
| 17  | `nkp-danse`             | `nkp-danse.webp`             | NKP Danse                           | https://www.facebook.com/nkpdanse/?locale=fr_FR      |
| 18  | `roquette`              | `roquette.webp`              | Roquette                            | https://www.roquette.com                             |
| 19  | `douai`                 | `douai.webp`                 | Ville de Douai                      | https://www.douai.fr                                 |
| 20  | `leroy-merlin`          | `leroy-merlin.webp`          | Leroy Merlin                        | https://www.leroymerlin.fr                           |
| 21  | `auchan`                | `auchan-v2.webp`             | Centre Commercial Aushopping V2     | https://v2.aushopping.com/                           |

## Ordre d’affichage

Tri par **date de modification** du fichier (du plus ancien au plus récent).
Après ajout de logos : `npm run sync:trusted-partners`

## Notes

- Pour un client sans site : laissez `website` vide ou supprimez la propriété dans `trustedPartners.ts`.
- Après modification des noms/URLs ici, synchronisez `trustedPartners.ts`.
