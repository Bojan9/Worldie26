import Link from "next/link";
import { Activity, Award, Database, Settings, Trophy, Users } from "lucide-react";
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
  { href: "/admin/matches", title: "Резултати", text: "Внеси конечни резултати и продолжи ги победниците во нокаут-фазата.", icon: Activity },
  { href: "/admin/standings", title: "Табели по групи", text: "Прегледај ги автоматски пресметаните табели.", icon: Trophy },
  { href: "/admin/awards", title: "Официјални награди", text: "Внеси ги четирите добитници и автоматски пресметај ги поените.", icon: Award },
  { href: "/admin/users", title: "Корисници и тимови", text: "Прегледај ги регистрираните играчи и турнирските репрезентации.", icon: Users },
  { href: "/admin/predictions", title: "Предвидувања", text: "Прегледај ги сите резултатски и турнирски предвидувања.", icon: Database },
  { href: "/admin/settings", title: "Одржување", text: "Пресметај ги поените повторно или ресетирај ги податоците.", icon: Settings },
];

export default async function AdminPage() {
  const { counts } = await getAdminData();

  return (
    <>
      <div>
        <h2 className="text-3xl font-black">Преглед</h2>
        <p className="mt-1 text-sm text-slate-400">Турнирски податоци, бодување и рачни контролни алатки.</p>
      </div>
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-9">
        <Metric label="Корисници" value={counts.users} />
        <Metric label="Тимови" value={counts.teams} />
        <Metric label="Натпревари" value={counts.matches} />
        <Metric label="Завршени" value={counts.completedMatches} />
        <Metric label="Предвидувања за мечеви" value={counts.matchPredictions} />
        <Metric label="Турнирски предвидувања" value={counts.tournamentPredictions} />
        <Metric label="Играчи" value={counts.players} />
        <Metric label="Предвидувања за награди" value={counts.awardPredictions} />
        <Metric label="Доделени поени" value={counts.totalPoints} />
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
