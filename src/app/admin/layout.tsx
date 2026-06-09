import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Database,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin-auth";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/matches", label: "Matches", icon: Activity },
  { href: "/admin/standings", label: "Standings", icon: Trophy },
  { href: "/admin/users", label: "Users & teams", icon: Users },
  { href: "/admin/predictions", label: "Predictions", icon: Database },
  { href: "/admin/settings", label: "Maintenance", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="theme-shell min-h-screen bg-[#07131f] text-white">
      <header className="border-b border-white/10 bg-[#081723]">
        <div className="mx-auto flex max-w-400 flex-col gap-5 px-5 py-6 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <Badge className="bg-lime-300/10 text-lime-300">
                <ShieldCheck className="size-3" /> Restricted administration
              </Badge>
              <h1 className="mt-3 text-3xl font-black tracking-tight">Worldie26 control room</h1>
            </div>
            <Button asChild className="w-fit bg-white/10 text-white hover:bg-white/15">
              <Link href="/"><ArrowLeft /> Back to game</Link>
            </Button>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-white/10 pt-4">
            {adminLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-bold text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="size-4" /> {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-400 px-5 py-8 lg:px-10">{children}</main>
    </div>
  );
}
