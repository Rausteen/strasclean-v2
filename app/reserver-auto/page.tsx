import { redirect } from "next/navigation";

// L'ancien formulaire /reserver-auto est remplacé par le tunnel /reserver.
// On redirige pour ne casser aucun lien existant (pubs, emails, site).
export default function ReserverAutoRedirect() {
  redirect("/reserver");
}
