import type { Metadata } from "next";

// L'admin n'est pas indexable par les moteurs
export const metadata: Metadata = {
  title: "Admin · StrasClean",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white text-slate-900">{children}</div>;
}
