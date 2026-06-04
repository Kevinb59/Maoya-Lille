# Maoya MakeUp — Lille

Site vitrine React pour **Maoya MakeUp**, maquilleuse professionnelle à Lille.

- **Stack** : React 19, TypeScript, Vite
- **Hébergement** : GitHub → import du dépôt sur [Vercel](https://vercel.com)
- **Dépôt GitHub** : [Kevinb59](https://github.com/Kevinb59)

## Démarrage local

```bash
npm install
cp .env.example .env.local   # puis renseigner les variables
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173).

## Scripts

| Commande        | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Serveur de développement |
| `npm run build` | Build de production      |
| `npm run preview` | Prévisualiser le build |
| `npm run lint`  | ESLint                   |
| `npm run video:pingpong` | Génère hero-pingpong.mp4 depuis RESSOURCES/.../hero2.mp4 |
| `npm run video:optimize` | Optimise chouchouter / coacher / divertir (sources RESSOURCES) |

## Performance (chargement)

- **Hero** : logo préchargé, vidéo en `preload="metadata"`.
- **3D (carte cadeau)** : chunk `vendor-three` + montage au scroll (`useDeferredMedia`).
- **Prestations / avis / partenaires / univers / infos** : `React.lazy` + `LazyWhenVisible` (chunks séparés).
- **Vidéos prestations** : chargées uniquement à l’approche du viewport, pause hors écran.
- **Polices** : une requête Google Fonts (Playfair 400 italic + Rochester).

## Structure du projet

```
src/
  components/layout/      # Layout global + footer
  components/navigation/# Menu fixe (SiteHeader)
  pages/home/sections/  # Sections de la page d'accueil (hero, …)
  lib/assets.ts           # Chemins des médias (pages/section/type)
  hooks/                  # Scroll du header, etc.
public/assets/
  pages/{page}/{section}/{videos|logos|images}/
RESSOURCES/pages/         # Miroir local non versionné des sources brutes
RESSOURCES/INSTRUCTIONS-EFFET-PARTICULES.md  # Guide Cursor portable — effet particules (copiable vers autre projet)
```

## Fichiers non versionnés

- `.env.local`, `.env.example` — variables d'environnement
- `RESSOURCES/` — ressources du projet en local uniquement (dont instructions Cursor)

Sur Vercel, définir les variables `VITE_*` dans **Project Settings → Environment Variables**.

## Déploiement Vercel

1. Pousser le projet sur GitHub
2. Importer le dépôt dans Vercel (framework **Vite** détecté automatiquement)
3. Build : `npm run build` — Output : `dist`
4. Ajouter les variables `VITE_SITE_URL`, `VITE_CONTACT_EMAIL`, etc.

Le fichier `vercel.json` configure le routage SPA (toutes les URLs → `index.html`).
