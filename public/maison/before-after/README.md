# Photos avant/après StrasClean Maison

Placez ici vos photos réelles d'interventions clients. Le composant
`components/HomeBeforeAfter.tsx` les détecte automatiquement et bascule du
placeholder en gradient vers les vraies photos.

## Convention de nommage

Format strict : `{service}-{kind}.{ext}`

- `{service}` : `canape`, `tapis`, `matelas`
- `{kind}` : `before` ou `after`
- `{ext}` : `webp` (recommandé), `jpg`, `jpeg`, `png` — l'ordre de
  priorité de recherche est : webp → jpg → jpeg → png

## Exemples

```
canape-before.webp
canape-after.webp
tapis-before.webp
tapis-after.webp
matelas-before.webp
matelas-after.webp
```

## Recommandations techniques

- **Dimensions** : 800×800 minimum (format carré pour l'affichage côte à côte).
  Idéal : 1200×1200.
- **Poids** : < 200 KB par image (WebP avec qualité 80 = parfait).
- **Cadrage** : centrer le sujet, garder un cadrage cohérent entre la photo
  avant et la photo après.
- **Anonymisation** : enlever toute marque personnelle visible (lettres,
  documents, photos de famille en arrière-plan).

## Conversion d'image

Si vous avez des `.jpg` lourds, convertissez-les en WebP avec :

```bash
# Avec cwebp (installer via "brew install webp" sur Mac)
cwebp -q 80 canape-before.jpg -o canape-before.webp

# Ou en ligne : squoosh.app (drag-and-drop)
```

## Après upload

```bash
git pull && rm -rf .next && npm run build && pm2 restart strasclean
```

Le rebuild régénère les pages statiques avec les vraies photos. Si certaines
photos manquent (ex: canape uploadé mais pas tapis), le composant affiche le
placeholder pour celles qui manquent — sans tout casser.
