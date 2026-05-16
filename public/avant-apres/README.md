# Photos avant/après StrasClean — Auto

Placez ici les photos d'interventions clients (verticale Auto). Le composant
`components/BeforeAfter.tsx` détecte automatiquement leur présence au build
et bascule du placeholder gradient vers les vraies photos.

## Convention de nommage

Format strict : `{stem}{avant|apres}.{ext}`

- `{stem}` : `siege`, `tapis`, `tableau`, `carrosserie`
- suffixe : `avant` ou `apres`
- `{ext}` : `webp` (recommandé), `jpg`, `jpeg`, `png` — priorité de
  recherche : webp → jpg → jpeg → png

## Fichiers attendus

```
siegeavant.webp      + siegeapres.webp
tapisavant.webp      + tapisapres.webp
tableauavant.webp    + tableauapres.webp
carrosserieavant.webp + carrosserieapres.webp
```

Soit **8 fichiers au total** (4 paires).

## Recommandations techniques

- **Format** : WebP qualité 80 (4-5× plus léger que JPEG sans perte visible)
- **Dimensions** : 800×600 minimum (4/3 cadré), idéal 1200×900
- **Poids** : <200 KB par image (sinon LCP affecté)
- **Cadrage cohérent** entre avant et après (même angle, même distance)
- **Anonymisation** : enlever plaques d'immatriculation, intérieur visible
  trop personnel, marques visibles

## Conversion d'image

```bash
# Avec cwebp (installer via "brew install webp" sur Mac)
cwebp -q 80 siege-avant.jpg -o siegeavant.webp

# Ou en ligne : squoosh.app (drag-and-drop, gratuit)
```

## Workflow recommandé

1. Prendre les photos lors d'une intervention (avant ET après, même angle)
2. Convertir en WebP qualité 80 (squoosh.app)
3. Renommer selon la convention ci-dessus
4. Copier ici dans `public/avant-apres/`
5. Commit dans git (les .webp sont versionnés)
6. Push + déployer sur VPS : `git pull && rm -rf .next && npm run build && pm2 restart strasclean`

Si certaines paires manquent, le composant affiche le placeholder gradient
pour celles qui manquent — pas de page cassée.

## Note pour le hero (`/public/hero.webp`)

Le hero auto (`components/Hero.tsx`) suit la même logique : si
`/public/hero.webp` (ou .jpg) est présent, il est affiché en `priority`
(LCP). Sinon, fallback gradient + emoji 🚗.

Dimensions hero recommandées : 1200×900, format WebP qualité 82.
