import { permanentRedirect } from "next/navigation";

// L'ancienne page Maison-only a été fusionnée dans /qui-sommes-nous global.
// 308 Permanent Redirect pour transférer le PageRank existant.
export default function MaisonQuiSommesNousRedirect() {
  permanentRedirect("/qui-sommes-nous");
}
