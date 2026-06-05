/**
 * LogoMark — la marque visuelle StrasClean.
 *
 * Un "spark" 4 branches blanc dans un carré arrondi avec un dégradé
 * 3 stops. Refletant l'identité "clean" (sparkle = brillance) tout en
 * étant assez distinct pour bien lire au favicon 16×16.
 *
 *  - variant="brand" (vert emerald, défaut) : marque canonique Auto
 *  - variant="amber" : variante Maison (header / footer Maison)
 *
 * IMPORTANT : le SVG est gardé strictement synchrone avec app/icon.svg
 * et public/favicon.svg pour que la marque soit identique partout
 * (site, onglet navigateur, écran d'accueil iOS, OG previews).
 */
type Props = {
  /** Taille en pixels (carré). Défaut 36. */
  size?: number;
  /** Couleur du dégradé de fond */
  variant?: "brand" | "amber";
  /** Classes Tailwind additionnelles sur le svg racine */
  className?: string;
};

export default function LogoMark({
  size = 36,
  variant = "brand",
  className,
}: Props) {
  // ID unique pour le linearGradient — évite les collisions si plusieurs
  // LogoMark sont rendus sur la même page (Header + Footer).
  const gradId = `logoMark-${variant}`;
  const stops =
    variant === "amber"
      ? ["#FCD34D", "#F59E0B", "#B45309"] // amber-300 → amber-500 → amber-700
      : ["#6EE7B7", "#10B981", "#047857"]; // emerald-300 → emerald-500 → emerald-700

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={stops[0]} />
          <stop offset="55%" stopColor={stops[1]} />
          <stop offset="100%" stopColor={stops[2]} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill={`url(#${gradId})`} />
      {/* 4-point spark, courbes concaves pour donner du tranchant */}
      <path
        d="M32 8 Q36 28 56 32 Q36 36 32 56 Q28 36 8 32 Q28 28 32 8 Z"
        fill="#FFFFFF"
      />
      {/* Highlight en haut-droite — évoque la réflexion / le "clean shine" */}
      <circle cx="48" cy="16" r="2.5" fill="#FFFFFF" opacity="0.55" />
    </svg>
  );
}
