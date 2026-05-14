import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) redirect("/admin/dashboard");
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600">
            <span className="text-ink-950 text-xl font-bold">★</span>
          </span>
          <span className="h-display text-xl font-bold">
            Stras<span className="text-brand-400">Clean</span>{" "}
            <span className="text-white/40 font-normal text-sm">· admin</span>
          </span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h1 className="h-display text-xl font-semibold mb-2">Connexion</h1>
          <p className="text-sm text-white/60 mb-6">
            Accès réservé à l'administrateur StrasClean.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
