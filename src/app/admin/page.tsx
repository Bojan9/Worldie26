import Link from "next/link";
import { Activity, Database, Settings, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAdminData } from "@/lib/admin-data";

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Card className="bg-white/4.5 p-5 text-white">
      <p className="text-[10px] font-black uppercase tracking-[.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </Card>
  );
}

const sections = [
  { href: "/admin/matches", title: "Match results", text: "Enter final scores and advance knockout winners.", icon: Activity },
  { href: "/admin/standings", title: "Group standings", text: "Review automatically calculated group tables.", icon: Trophy },
  { href: "/admin/users", title: "Users & teams", text: "Inspect registered players and tournament teams.", icon: Users },
  { href: "/admin/predictions", title: "Predictions", text: "Review every score and tournament prediction.", icon: Database },
  { href: "/admin/settings", title: "Maintenance", text: "Recalculate points or reset competition data.", icon: Settings },
];

export default async function AdminPage() {
  const { counts } = await getAdminData();

  return (
    <>
      <div>
        <h2 className="text-3xl font-black">Overview</h2>
        <p className="mt-1 text-sm text-slate-400">Tournament data, scoring and manual recovery controls.</p>
      </div>
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Metric label="Users" value={counts.users} />
        <Metric label="Teams" value={counts.teams} />
        <Metric label="Matches" value={counts.matches} />
        <Metric label="Completed" value={counts.completedMatches} />
        <Metric label="Match picks" value={counts.matchPredictions} />
        <Metric label="Bracket picks" value={counts.tournamentPredictions} />
        <Metric label="Points awarded" value={counts.totalPoints} />
      </section>
      <section className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ href, title, text, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="h-full bg-white/4.5 p-6 text-white transition hover:bg-white/7.5">
              <Icon className="size-6 text-lime-300" />
              <h3 className="mt-4 text-xl font-black">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
}
