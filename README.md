# Dépôt partagé — LM Rénov' Habitat & Symo solutions

Deux projets Web vivent ici, dans des dossiers séparés :

| Dossier | Projet | Déploiement typique |
|--------|--------|----------------------|
| **`lm-renov-habitat/`** | Site artisan (toiture, façade, devis…) | Ex. `lm-renov-habitat.vercel.app` — définir la racine du projet Vercel sur ce dossier. |
| **`symo-solutions/`** | Site vitrine agence, blog, espace client React (`dashboard/`), sortie **`symo-site/`** | `npm run sync-symo` puis déploiement du dossier **`symo-site/`** (voir `symo-solutions/scripts/deploy-symo.ps1`). |

## Commandes utiles (Symo)

À la racine du dépôt :

- `npm run symo:sync` — build dashboard + copie vers `symo-solutions/symo-site/`
- `npm run symo:dashboard:dev` — Vite du dashboard en local

Ou depuis **`symo-solutions/`** : `npm run sync-symo`, etc.

## LM Rénov'

Ouvrir ou servir **`lm-renov-habitat/index.html`** (avec `LOGO/`, `Image/`, `style.css` au même niveau).
