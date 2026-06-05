import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated, checkSameOrigin } from "@/lib/auth";

/**
 * Force la régénération du HTML statique des home pages.
 *
 * Pourquoi c'est utile : les pages `/` et `/strasclean-maison` sont
 * pré-rendues au build avec `revalidate = 3600`. Le build se passe DANS
 * une image Docker fraîche où le bind-mount `./data` n'est pas actif →
 * la DB est vide → les avis Google ne sont pas baked-in dans le HTML.
 *
 * À l'exécution, il faut attendre 1h (revalidate) OU appeler cette route
 * pour forcer Next à régénérer immédiatement les pages avec les avis
 * actuellement en DB (et avec tous les tags du moment).
 *
 * Sécurité : auth admin + same-origin (CSRF).
 */
export async function POST(req: Request) {
  if (!checkSameOrigin(req)) {
    return NextResponse.json({ error: "Origine refusée" }, { status: 403 });
  }
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Invalide les 2 home + le hub guide pour faire bonne mesure
  revalidatePath("/", "page");
  revalidatePath("/strasclean-maison", "page");
  revalidatePath("/guide", "page");

  return NextResponse.json({
    ok: true,
    revalidated: ["/", "/strasclean-maison", "/guide"],
    ts: Date.now(),
  });
}
