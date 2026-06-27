import type { Metadata } from "next";
import { isTeamAuthenticated } from "@/lib/auth";
import { listJobs } from "@/lib/db";
import JobsApp from "./JobsApp";
import LoginForm from "./LoginForm";

// App interne de l'équipe (carnet de jobs). Jamais indexée.
export const metadata: Metadata = {
  title: "Équipe — StrasClean",
  robots: { index: false, follow: false },
};

// Lit cookies + base à chaque requête.
export const dynamic = "force-dynamic";

export default async function EquipePage() {
  if (!(await isTeamAuthenticated())) {
    return <LoginForm />;
  }
  return <JobsApp initialJobs={listJobs()} />;
}
