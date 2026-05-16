import { permanentRedirect } from "next/navigation";

// 308 Permanent Redirect — l'URL canonique est /strasclean-maison.
// Google transfère 100% du PageRank en 308, contrairement au 307 temporaire.
export default function MaisonRedirect() {
  permanentRedirect("/strasclean-maison");
}
