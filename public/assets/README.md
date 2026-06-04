# Assets du site (versionnés)

Structure : **`pages / {page} / {section} / {type} / fichier`**

| Niveau   | Exemple | Rôle                          |
|----------|---------|-------------------------------|
| `pages`  | `home`  | Page du site                  |
| section  | `hero`  | Bloc visuel de la page        |
| type     | `videos`, `logos`, `images` | Nature du fichier |

## Page d'accueil — section hero

```
pages/home/intro/
  images/   → intro.webp (recto), intro2.webp (verso)

pages/home/hero/
  videos/
    hero-pingpong.mp4 → boucle fluide avant/arrière (servi sur le site)
  logos/    → logo-maoya.svg ou .png
  images/   → hero-poster.jpg (optionnel)
```

Source vidéo brute : `RESSOURCES/pages/home/hero/videos/hero2.mp4` (non versionnée).

Après avoir remplacé la source, régénérez le ping-pong :

```bash
npm run video:pingpong
```

```
pages/home/univers/images/
  makeup.webp, shop.webp, event.webp, formation.webp

pages/home/trusted-partners/logos/
  → logos entreprises (section « Ils nous ont fait confiance »)
  ex. sephora.webp, kiabi.webp — voir README dans le dossier

shared/social/icons/
  instagram.svg
  facebook.svg
```

Bandeaux prestations (sources dans `RESSOURCES/`, versions web via `npm run video:optimize`) :

```
pages/home/chouchouter/videos/chouchouter.mp4
pages/home/coacher/videos/coacher.mp4
pages/home/divertir/videos/divertir.mp4
```

Les chemins sont référencés dans `src/lib/assets.ts`, `src/config/homePrestations.ts` et `src/config/social.ts`.
