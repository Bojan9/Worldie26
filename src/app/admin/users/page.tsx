import { format } from "date-fns";
import { mk } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { getAdminData } from "@/lib/admin-data";

export default async function AdminUsersPage() {
  const data = await getAdminData();
  return (
    <>
      <h2 className="text-3xl font-black">Корисници и тимови</h2>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="gap-0 overflow-hidden bg-white/4.5 py-0 text-white">
          <div className="p-5"><h3 className="text-xl font-black">Регистрирани корисници</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-155 text-left text-sm">
              <thead className="bg-black/20 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="p-3">Име</th><th>Е-пошта</th><th>Clerk ID</th><th>Креиран</th></tr></thead>
              <tbody>{data.users.map((user) => <tr key={user.id} className="border-t border-white/5"><td className="p-3 font-bold">{user.displayName}</td><td className="text-slate-400">{user.email ?? "-"}</td><td className="font-mono text-xs text-slate-500">{user.id}</td><td className="text-slate-500">{format(user.createdAt, "d MMM yyyy", { locale: mk })}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
        <Card className="gap-0 overflow-hidden bg-white/4.5 py-0 text-white">
          <div className="p-5"><h3 className="text-xl font-black">Тимови</h3></div>
          <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-3">
            {data.teams.map((team) => <div key={team.id} className="bg-[#0b1825] p-3"><p className="font-bold">{team.name}</p><p className="text-xs text-slate-500">{team.id} · Група {team.group}</p></div>)}
          </div>
        </Card>
      </div>
    </>
  );
}
