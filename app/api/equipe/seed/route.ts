import { NextResponse } from "next/server";
import { isTeamAuthenticated } from "@/lib/auth";
import { listJobs, insertJob } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Import unique des jobs historiques (rattrapage prod). Idempotent : ne fait
// rien si des jobs existent déjà → impossible de créer des doublons.
// Une fois utilisé, tu peux supprimer ce fichier (app/api/equipe/seed/).
//
// [date, téléphone, prestation, véhicule, prix, suppléments, total, paiement, source]
const ROWS: [string, string, string, string, number, number, number, string, string][] = [
  ["10/06/2026", "0671105683", "Intégrale StrasClean", "Berline", 129, 0, 129, "Espèces", "Formulaire"],
  ["21/06/2026", "", "Essentiel", "Citadine", 39, 0, 39, "Espèces", "WhatsApp"],
  ["24/06/2026", "", "Premium Intérieur", "Citadine", 79, 0, 79, "Espèces", "Téléphone"],
  ["24/06/2026", "", "Intégrale StrasClean", "Citadine", 119, 0, 119, "Espèces", "Téléphone"],
  ["26/06/2026", "", "Premium Intérieur", "Berline", 89, 0, 89, "Espèces", "WhatsApp"],
  ["16/06/2026", "", "Intégrale StrasClean", "Citadine", 119, 0, 119, "Espèces", "WhatsApp"],
  ["23/06/2026", "", "Essentiel", "SUV", 59, 0, 59, "Espèces", "Téléphone"],
  ["25/06/2026", "", "Premium Intérieur", "Citadine", 79, 0, 79, "Virement", "WhatsApp"],
  ["27/06/2026", "", "Intégrale StrasClean", "Berline", 129, 30, 159, "Espèces", "WhatsApp"],
  ["27/06/2026", "", "Intégrale StrasClean", "SUV", 139, 0, 139, "Espèces", "WhatsApp"],
];

function tsOf(d: string): number {
  const [day, m, y] = d.split("/").map(Number);
  return new Date(y, m - 1, day, 9, 0, 0).getTime();
}

export async function GET() {
  if (!(await isTeamAuthenticated())) {
    return NextResponse.json(
      { ok: false, error: "Connecte-toi d'abord sur /equipe, puis recharge cette page." },
      { status: 401 },
    );
  }

  // Garde-fou anti-doublon : on n'importe que si la table est vide.
  if (listJobs(1).length > 0) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      message: "Des jobs existent déjà — import ignoré (pas de doublon).",
    });
  }

  let imported = 0;
  for (const [d, phone, prestation, vehicle_type, price, supplements, total, payment, source] of ROWS) {
    insertJob({
      ts: tsOf(d),
      phone: phone || null,
      prestation,
      vehicle_type,
      price,
      supplements,
      total,
      collected: 1,
      payment,
      source,
      status: "termine",
      notes: null,
    });
    imported++;
  }

  return NextResponse.json({ ok: true, imported, message: "Import terminé. Va sur /equipe." });
}
