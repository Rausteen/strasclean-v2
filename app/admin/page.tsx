import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminIndex() {
  if (await isAuthenticated()) redirect("/admin/dashboard");
  redirect("/admin/login");
}
